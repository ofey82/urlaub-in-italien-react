import { useState, useEffect } from 'react';
import { getTripDetails, uploadPhotos, createStory, updateTrip, updateStory, getStoryDetails } from '../api/api';
import PhotoUpload from './PhotoUpload';
import StoryModal from './StoryModal';
import { useParams } from "react-router-dom";
import EditTripModal from "./EditTripModal.jsx";
import {format, isValid} from 'date-fns';
import '../styles/TripDetail.css';

const API_URL = 'http://localhost:8080';

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
            Photos: updatedTrip.Photos // Hier wurde der Fehler korrigiert
          }));
          console.log('Trip after photo upload:', trip);
        })
        .catch(error => console.error('Error uploading photos:', error));
  };

  const handleCreateStory = (updatedStory) => {
    const { title, text } = updatedStory;
    const photoIds = selectedPhotos.map(photo => photo.id);
    createStory(id, photoIds, title, text) // id = tripId
        .then(newStory => {
          setTrip(prevTrip => ({
            ...prevTrip,
            Stories: [...prevTrip.Stories, newStory] // Fügen Sie die neue Story zur bestehenden Liste hinzu
          }));
          setShowStoryModal(false);
          setSelectedPhotos([]);
        })
        .catch(error => console.error('Error creating story:', error));
  };

  const handleEditStory = (updatedStory) => {
    const { id, title, text } = updatedStory //id = storyId
    updateStory(id, title, text)
        .then(updatedTrip => {
          // Aktualisiere den trip State mit den geänderten Story-Daten
          setTrip(prevTrip => ({
            ...prevTrip,
            Stories: updatedTrip.Stories
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

  if (!trip) return <div>Loading...</div>;

  const formattedStartDate = isValid(new Date(trip.startDate)) ? format(new Date(trip.startDate), 'dd.MM.yyyy') : 'Invalid Date';
  const formattedEndDate = isValid(new Date(trip.endDate)) ? format(new Date(trip.endDate), 'dd.MM.yyyy') : 'Invalid Date';

  console.log("trip", trip);

  return (
      <div className="trip-detail-container">
        <div className="trip-title-container">
          <div className="trip-title">{trip.title}</div>
          <button className="edit-button" onClick={() => setShowEditModal(true)}>Edit</button>
        </div>
        <div className="trip-details">
          <div className="trip-period">from {formattedStartDate} until {formattedEndDate}</div>
          <p>{trip.description}</p>
        </div>
        <div className="trip-actions">
          <PhotoUpload onUpload={handlePhotoUpload}/>
          <button onClick={() => {
            setCurrentStory(null);
            setShowStoryModal(true);
          }}>Neue Story</button>
        </div>
        <div className="trip-content">
          <div className="photo-grid">
            {trip.Photos && trip.Photos.map(photo => (
                <img
                    key={photo.id}
                    src={`${API_URL}/${photo.url}`}
                    alt=""
                    className={selectedPhotos.some(p => p.id === photo.id) ? 'selected' : ''}
                    onClick={() =>
                    {
                      if (selectedPhotos.some(p => p.id === photo.id)) {
                        setSelectedPhotos(selectedPhotos.filter(p => p.id !== photo.id));
                      } else {
                        setSelectedPhotos([...selectedPhotos, photo]);
                      }
                    }}
                />
            ))}
          </div>
          <div className="story-list">
            {trip.Stories && trip.Stories.map(story => (
                <div key={story.id} className="story-item" onClick={() => {
                  getStoryDetails(story.id)
                      .then(storyDetails => {
                        setCurrentStory({
                          ...storyDetails,
                          photos: storyDetails.Photos || []
                        });
                        setShowStoryModal(true);
                      })
                      .catch(error => console.error('Error fetching story details:', error));
                }}>
                  <div className="story-details">
                    <p className="story-title">{story.title}</p>
                    <p className="story-text">{story.text}</p>
                  </div>
                  <div className="story-photos">
                    {story.Photos && story.Photos.length > 0 ? (
                        story.Photos.map(photo => (
                            <img key={photo.id} src={`${API_URL}/${photo.url}`} alt="Story Photo" />
                        ))
                    ) : (
                        <p>Keine Fotos</p>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </div>
        {showStoryModal && (
            <StoryModal
                story={currentStory}
                photos={currentStory ? currentStory.photos : selectedPhotos}
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
