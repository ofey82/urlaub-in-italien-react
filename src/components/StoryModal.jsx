import { useState, useEffect } from 'react';
import '../styles/StoryModal.css';

const StoryModal = ({ story, photos = [], onSave, onClose }) => {
  const [title, setTitle] = useState(story ? story.title : '');
  const [text, setText] = useState(story ? story.text : '');

  const API_URL = 'http://localhost:8080/';

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setText(story.text);
    }
  }, [story]);

  const handleSave = () => {
    const updatedStory = {
      ...story,
      title,
      text,
      photos,
    };
    onSave(updatedStory);
  };

  return (
      <div className="story-modal-overlay">
        <div className="story-modal-content">
          <h2>{story ? 'Edit Story' : 'Neue Story'}</h2>
          <div className="photo-grid">
            {photos.map(photo => (
                <img key={photo.id} src={`${API_URL}${photo.url}`} alt="" />
            ))}
          </div>
          <input
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
              placeholder="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleSave}>{story ? 'Speichern' : 'Create'}</button>
          <button onClick={onClose}>Schließen</button>
        </div>
      </div>
  );
};

export default StoryModal;
