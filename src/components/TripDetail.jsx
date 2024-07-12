import { useState, useEffect } from 'react';
import { getTripDetails, uploadPhotos, createStory, updateTrip, updateStory, getStoryDetails, setCoverPhoto } from '../api/api';
import PhotoUpload from './PhotoUpload';
import StoryModal from './StoryModal';
import { useParams } from "react-router-dom";
import EditTripModal from "./EditTripModal.jsx";
import { format, isValid } from 'date-fns';
import '../styles/TripDetail.css';

const API_URL = 'http://localhost:8080/';

const TripDetail = () => {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);

  useEffect(() => {
    if (id) {
      getTripDetails(id)
          .then(data => {
            console.log('Trip details:', data);
            setTrip(data);
          })
          .catch(error => console.error('Error fetching trip details:', error));
    }
  }, [id]);

  const handlePhotoUpload = (photos) => {
    uploadPhotos(id, photos)
        .then(updatedTrip => {
          setTrip(prevTrip => ({
            ...prevTrip,
            Photos: updatedTrip.Photos
          }));
        })
        .catch(error => console.error('Error uploading photos:', error));
  };

  const handleCreateStory = (updatedStory) => {
    const { title, text } = updatedStory;
    const photoIds = selectedPhotos.map(photo => photo.id);
    createStory(id, photoIds, title, text)
        .then(newStory => {
          setTrip(prevTrip => ({
            ...prevTrip,
            Stories: [...(prevTrip.Stories || []), newStory]
          }));
          setShowStoryModal(false);
          setSelectedPhotos([]);
        })
        .catch(error => console.error('Error creating story:', error));
  };

  const handleEditStory = (updatedStory) => {
    const { id, title, text } = updatedStory;
    updateStory(id, title, text)
        .then(updatedStory => {
          setTrip(prevTrip => ({
            ...prevTrip,
            Stories: prevTrip.Stories.map(story =>
                story.id === updatedStory.id ? updatedStory : story
            )
          }));
          setShowStoryModal(false);
          setCurrentStory(null);
        })
        .catch(error => console.error('Error updating story:', error));
  };

  const handleCloseStoryModal = () => {
    setShowStoryModal(false);
    setSelectedPhotos([]);
    setCurrentStory(null);
  };

  const handleEditTrip = (updatedTrip) => {
    updateTrip(updatedTrip.id, updatedTrip)
        .then(() => {
          setTrip(updatedTrip);
          setShowEditModal(false);
        })
        .catch(error => console.error('Error updating trip:', error));
  };

  const handleCloseTripModal = () => {
    setShowEditModal(false);
  };

  const handlePhotoClick = (photo) => {
    const story = (trip.Stories || []).find(story => (story.Photos || []).some(p => p.id === photo.id));
    if (story) {
      getStoryDetails(story.id)
          .then(storyDetails => {
            setCurrentStory({
              ...storyDetails,
              Photos: storyDetails.Photos || []
            });
            setShowStoryModal(true);
          })
          .catch(error => console.error('Error fetching story details:', error));
    } else {
      setCurrentStory(null );
      setSelectedPhotos([photo]);
      setShowStoryModal(true);
    }
  };

  const handleContextMenu = (event, photo) => {
    event.preventDefault();
    setCoverPhoto(id, photo.id)
        .then(updatedTrip => {
          setTrip(prevTrip => ({
            ...prevTrip,
            coverPhoto: photo.url
          }));
        })
        .catch(error => console.error('Error setting cover photo:', error));
  };

  if (!trip) return <div>Loading...</div>;

  const formattedStartDate = isValid(new Date(trip.startDate)) ? format(new Date(trip.startDate), 'dd.MM.yyyy') : format(new Date(), 'dd.MM.yyyy');
  const formattedEndDate = isValid(new Date(trip.endDate)) ? format(new Date(trip.endDate), 'dd.MM.yyyy') : format(new Date(), 'dd.MM.yyyy');

  const highlights = trip.highlights ? trip.highlights.split(',').map(highlight => highlight.trim()) : [];

  return (
      <div className="trip-container">
        <div className="trip-title-container">
          <div className="trip-title">{trip.title}</div>
          <button className="edit-button" onClick={() => setShowEditModal(true)}>Edit Your Trip</button>
        </div>
        <div className="trip-info-container">
          <div className="trip-period-participant-container">
            <div className="trip-period">
              <span className="trip-icon-period"><i className="fa-solid fa-calendar-days"></i></span>
              <span className="trip-date">{formattedStartDate} - {formattedEndDate}</span>
            </div>
            <div className="trip-participant">
              <span className="trip-icon-participant"><i className="fa-solid fa-user-group"></i></span>
              <span className="trip-icon-participant">{trip.participants}</span>
            </div>
          </div>
          <div className="trip-description-container">
            <div className="trip-description">{trip.description}</div>
            <div className="trip-highlights">
              {highlights.map((highlight, index) => (
                  <p key={index} className="highlight">#{highlight}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="trip-actions-container">
          <PhotoUpload onUpload={handlePhotoUpload} />
        </div>
        <div className="trip-content-container">
          <div className="photo-grid">
            {trip.Photos && trip.Photos.map(photo => {
              const story = (trip.Stories || []).find(story => (story.Photos || []).some(p => p.id === photo.id));
              return (
                  <div key={photo.id} className="photo-item" onContextMenu={(e) => handleContextMenu(e, photo)}>
                    <img
                        src={`${API_URL}${photo.url}`}
                        alt=""
                        className={selectedPhotos.some(p => p.id === photo.id) ? 'selected' : ''}
                        onClick={() => handlePhotoClick(photo)}
                    />
                    {story && (
                        <div className="photo-icon" onClick={() => handlePhotoClick(photo)}>
                          <i className="far fa-comment-dots"></i>
                        </div>
                    )}
                  </div>
              );
            })}
          </div>
        </div>
        {showStoryModal && (
            <StoryModal
                story={currentStory}
                photos={currentStory ? currentStory.Photos : selectedPhotos}
                onSave={currentStory ? handleEditStory : handleCreateStory}
                onClose={handleCloseStoryModal}
            />
        )}
        {showEditModal && (
            <EditTripModal
                trip={trip}
                onSave={handleEditTrip}
                onClose={handleCloseTripModal}
            />
        )}
      </div>
  );
};

export default TripDetail;
