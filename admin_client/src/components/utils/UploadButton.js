import React, { useState } from 'react';
import axios from 'axios';

const UploadButton = ({ orgId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Make a POST request to your backend API to handle the file upload
      await axios.post(`http://localhost:5000/upload-image/${orgId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      setUploadMessage('Image uploaded successfully!');
      // Optionally, you can show a success message or update the UI after successful upload
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default UploadButton;
