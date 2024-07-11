import { useState } from 'react';
import '../styles/EditTripModal.css';

const EditTripModal = ({ trip, onClose, onSave }) => {
  const [title, setTitle] = useState(trip.title || '');
  const [description, setDescription] = useState(trip.description || '');
  const [participants, setParticipants] = useState(trip.participants || '');
  const [startDate, setStartDate] = useState(trip.startDate || '');
  const [endDate, setEndDate] = useState(trip.endDate || '');
  const [highlights, setHighlights] = useState(trip.highlights || '');

  const handleSave = () => {
    const updatedTrip = {
      ...trip,
      title,
      description,
      participants,
      startDate,
      endDate,
      highlights,
    };
    onSave(updatedTrip);
  };

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Trip</h2>
          <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
          <input
              type="text"
              placeholder="Participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
          />
          <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
          />
          <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
          />
          <textarea
              placeholder="Highlights"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
  );
};

export default EditTripModal;
