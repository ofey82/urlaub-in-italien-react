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
    } else {
      setTitle('');
      setText('');
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
          <h2>{story ? 'Edit Your Story' : 'Create New Story'}</h2>
          <div className="story-modal-body">
            <div className="photo-container">
              {photos.map(photo => (
                  <img key={photo.id} src={`${API_URL}${photo.url}`} alt="" />
              ))}
            </div>
            <div className="story-text-container">
              <textarea
                  placeholder="Write your story here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
              />
              <div className="modal-buttons">
                <button className="save-story" onClick={handleSave}>{story ? 'Save' : 'Create'}</button>
                <button className="close-story" onClick={onClose}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default StoryModal;
