import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
const UploadButton = ({ orgId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file ? file.name : '');
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
      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="outlined" component="span" style={{ marginRight: '10px' }}>
          Choose Image
        </Button>
      </label>
      <Button variant="contained" onClick={handleUpload}>Upload Image</Button>
      {selectedFileName && <p>Selected file: {selectedFileName}</p>}
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default UploadButton;
