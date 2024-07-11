const PhotoUpload = ({ onUpload }) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    onUpload(files);
  };

  return (
      <div className="photo-upload">
        <input type="file" multiple onChange={handleFileChange} />
      </div>
  );
};

export default PhotoUpload;
