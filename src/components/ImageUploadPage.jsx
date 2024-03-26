import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage'; // Additional imports for listing and deleting
import { updateDoc, doc, getDoc } from 'firebase/firestore'; // Replace with your Firebase instance
import { storage, firestore } from '../firebaseConfig'; // Assuming Firebase config import

const ImageUpload = () => {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [images, setImages] = useState([]); // State to store retrieved images

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Build the storage reference for the location
        const locationRef = ref(storage, `locations/${locationId}`);

        // List all images in the location folder
        const imageList = await listAll(locationRef);
        const imageUrls = await Promise.all(
          imageList.items.map((itemRef) => getDownloadURL(itemRef))
        );

        setImages(imageUrls); // Set the retrieved image URLs
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages(); // Call the function on component mount
  }, [locationId]); // Re-fetch images on locationId change

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      console.error('Please select an image to upload.');
      return;
    }

    setUploadError(null); // Clear any previous errors

    try {
      // Build the storage reference path based on locationId
      const storageRef = ref(storage, `locations/<span class="math-inline">\{locationId\}/</span>{selectedImage.name}`);

      await uploadBytes(storageRef, selectedImage);
      const imageURL = await getDownloadURL(storageRef);
      setImageUrl(imageURL);

      console.log('Image uploaded successfully:', imageURL);
      setSelectedImage(null); // Clear image selection after upload

      // Update the location document (assuming a field named 'id' for document ID)
      const locationRef = doc(firestore, 'locations', locationId);

      // Check if the location document exists and retrieve data
      const locationDocSnap = await getDoc(locationRef);
      const locationDoc = locationDocSnap.data(); // Extract data from snapshot
      if (!locationDoc) {
        console.error('Location document not found:', locationId);
        return; // Exit the function if document doesn't exist
      }

      // **Handle potential absence of 'images' field:**
      if (!locationDoc) {
        console.error('Location document data is undefined.');
        return; // Exit the function if data is undefined
      }

      const images = locationDoc.images || []; // Use spread syntax for default value

      // Update the document with the new image URL in the 'images' array
      await updateDoc(locationRef, {
        images: [...images, imageURL], // Add the image URL to the array
      });
      
      console.log('Location document updated with image URL.');
      // Update the state to remove the uploaded image from the displayed list
      setImages([...images, imageURL]); // Update state with new image
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.message); // Set error message for display
    }
  };
  const handleDeleteImage = async (imageUrl) => {
    try {
      // Extract the image filename from the URL (assuming specific structure)
      const filename = imageUrl.split('/').pop();
  
      // Build the storage reference for the image
      const imageRef = ref(storage, `locations/${locationId}/${filename}`);
  
      // Delete the image from storage
      await deleteObject(imageRef);
  
      // Update the location document to remove the image URL from the 'images' array
      const locationRef = doc(firestore, 'locations', locationId);
      const locationDoc = await getDoc(locationRef);
      const locationData = locationDoc.data();
  
      if (!locationData) {
        console.error('Location document data is undefined.');
        return;
      }
  
      const updatedImages = locationData.images.filter((image) => image !== imageUrl);
  
      await updateDoc(locationRef, {
        images: updatedImages,
      });
  
      // Update the state to remove the deleted image from the displayed list
      setImages(images.filter((image) => image !== imageUrl));
  
      console.log('Image deleted successfully:', imageUrl);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Handle potential errors (e.g., display error message)
    }
  };

  return (
    <div>
      <h2>Upload Image for Location: {locationId}</h2>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Upload Image</button>
      {uploadError && <p className="error-message">{uploadError}</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded Image" />}
      <button onClick={() => navigate('/locations')}>Back to Locations</button>
      <div>
        <h3>Existing Images:</h3>
        {images.length > 0 ? (
          images.map((imageUrl) => (
            <div key={imageUrl}>
              <img src={imageUrl} alt="Location Image" />
              <button onClick={() => handleDeleteImage(imageUrl)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No images found for this location.</p>
        )}
      </div>
    </div>
  );
  }
export default ImageUpload