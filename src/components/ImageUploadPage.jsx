import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Replace with your Firebase Storage instance
import { updateDoc } from 'firebase/firestore'; // Replace with your Firebase instance
import { storage, firestore } from '../firebaseConfig'; // Assuming Firebase config import

const ImageUploadPage = () => {
  const { locationId } = useParams(); // Get location ID from route param
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // Stores uploaded image URL

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return; // Handle missing image

    const storageRef = ref(storage, `locations/${locationId}/${selectedImage.name}`);
    try {
      await uploadBytes(storageRef, selectedImage);
      const imageURL = await getDownloadURL(storageRef); // Get uploaded image URL
      setImageUrl(imageURL);

      // Update location document with image URL (assuming a field named "images")
      const updatedLocation = {
        images: {
          // Assuming the map key to store the image URL is "url":
          url: imageURL,
        },
      };

      console.log('Updated Location Data:', updatedLocation); // Added for debugging

      await updateDoc(doc(collection(firestore, 'locations'), locationId), updatedLocation);

      console.log('Image uploaded successfully:', imageURL);
      setSelectedImage(null); // Clear image selection after upload
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h2>Upload Images for Location: {locationId}</h2>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Upload Image</button>
      {imageUrl && <img src={imageUrl} alt="Uploaded Image" />}
      <button onClick={() => navigate('/locations')}>Back to Locations</button>
    </div>
  );
};

export default ImageUploadPage;
