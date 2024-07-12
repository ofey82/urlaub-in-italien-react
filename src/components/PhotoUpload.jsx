const PhotoUpload = ({ onUpload }) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    onUpload(files);
  };

  return (
      <div className="photo-upload">
        <label className="upload-button">
          Upload Photos
          <input type="file" multiple accept=".jpg, .jpeg" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
      </div>
  );
};

export default PhotoUpload;
