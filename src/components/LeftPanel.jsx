import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Replace with your Firebase Storage instance
import { updateDoc, doc, collection, query, where, getDocs } from 'firebase/firestore'; // Replace with your Firebase instance
import { storage, firestore } from '../firebaseConfig'; // Assuming Firebase config import

const ImageUploadPage = () => {
  const { locationId } = useParams(); // Get locationId only
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // Stores uploaded image URL
  const [locationData, setLocationData] = useState(null); // Stores fetched location data
  const [isLoading, setIsLoading] = useState(true); // Flag for loading state

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationsRef = collection(firestore, 'locations');
        const locationQuery = query(locationsRef, where('locationId', '==', locationId)); // Create query based on locationId
        const querySnapshot = await getDocs(locationQuery);

        if (!querySnapshot.empty) {
          const locationDoc = querySnapshot.docs[0];
          setLocationData(locationDoc.data()); // Access data directly from the document
        } else {
          console.error('Location not found with ID:', locationId);
          // Handle the case where the location doesn't exist (e.g., display message)
        }
      } catch (error) {
        console.error('Error fetching location document:', error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchLocationData();
  }, [locationId, firestore]); // Run effect only when locationId or firestore changes

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return; // Handle missing image

    if (!locationData) {
      console.error('Location data unavailable for upload.');
      return; // Handle the case where location data is not yet fetched
    }

    // Build the storage reference path based on location data (optional)
    let storageRef;
    if (locationData.hasOwnProperty('imageFolder')) {
      storageRef = ref(storage, `locations/<span class="math-inline">\{locationData\.id\}/</span>{locationData.imageFolder}/${selectedImage.name}`);
    } else {
      storageRef = ref(storage, `locations/<span class="math-inline">\{locationData\.id\}/</span>{selectedImage.name}`);
    }

    try {
      await uploadBytes(storageRef, selectedImage);
      const imageURL = await getDownloadURL(storageRef); // Get uploaded image URL
      setImageUrl(imageURL);

      // Assuming "images" is an array in the location document:
      const updatedLocation = {
        images: [...(locationData.images || []), { url: imageURL }], // Add new image object to the array
      };

      console.log('Updated Location Data:', updatedLocation); // Added for debugging

      await updateDoc(doc(firestore, 'locations', locationData.id), updatedLocation);

      console.log('Image uploaded successfully:', imageURL);
      setSelectedImage(null); // Clear image selection after upload
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h2>Upload Images for Location: {locationId}</h2>
      {isLoading ? (
        <p>Loading location data...</p>
      ) : (
        <>
          {locationData ? (
            <>
              <input type="file" onChange={handleImageChange} />
              <button onClick={handleImageUpload}>Upload Image</button>
            </>
          ) : (
            <p>Location not found.</p>
          )}
        </>
      )}
      {imageUrl && <img src={imageUrl} alt="Uploaded Image" />}
      <button onClick={() => navigate('/locations')}>Back to Locations</button>

</div>)}
export default ImageUploadPage