import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, auth, storage } from '../firebaseConfig'; // Ensure correct imports
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { collection, getDocs, addDoc, deleteDoc, query, where, doc } from 'firebase/firestore';

const LocationImages = () => {
  const { id } = useParams(); // Get the location ID from URL params
  const [images, setImages] = useState([]); // State to hold the list of images
  const [uploading, setUploading] = useState(false); // State to handle upload status
  const [user] = useAuthState(auth); // State to handle authentication

  useEffect(() => {
    fetchImagesFromLocation(id); // Fetch images when the component mounts or ID changes
  }, [id]);

  const fetchImagesFromLocation = async (locationId) => {
    try {
      // Reference to the locations collection
      const locationsRef = collection(firestore, 'locations');
      
      // Query to find the document with the specified `id` field
      const q = query(locationsRef, where('id', '==', locationId));
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Extract the document ID and fetch images
        querySnapshot.docs.forEach(async (doc) => {
          const documentId = doc.id; // Firestore document ID
          
          // Reference to the images subcollection within the location document
          const imagesRef = collection(firestore, `locations/${documentId}/images`);
          
          // Fetch the images
          const imagesSnapshot = await getDocs(imagesRef);
          const imagesList = imagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Set the images state
          setImages(imagesList);
          
          // Log the images data
          console.log('Images Data:', imagesList);
        });
      } else {
        console.log('No matching location document found!');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      
      // Log the selected file for debugging
      console.log('Selected file:', file);
  
      try {
        // Create a reference to the file in Firebase Storage
        const imageRef = ref(storage, `locations/${id}/${file.name}`);
        
        // Upload the file to Firebase Storage
        const uploadResult = await uploadBytes(imageRef, file);
        console.log('Upload result:', uploadResult);
  
        // Get the download URL for the uploaded file
        const url = await getDownloadURL(imageRef);
        console.log('Download URL:', url);
  
        // Query Firestore to find the document with the specified `id` field
        const locationsRef = collection(firestore, 'locations');
        const q = query(locationsRef, where('id', '==', id));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          // Extract the document ID from the query snapshot
          const documentId = querySnapshot.docs[0].id; // Assuming only one document matches
  
          // Add the file details to the Firestore images collection
          const imagesRef = collection(firestore, `locations/${documentId}/images`);
          await addDoc(imagesRef, { url, name: file.name });
          console.log('Image added to Firestore');
  
          // Refresh the image list
          fetchImagesFromLocation(id);
        } else {
          console.log('No matching location document found!');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
      }
    } else {
      console.warn('No file selected');
    }
  };
  

  const handleDelete = async (imageId, imageName) => {
    if (!user) {
      alert('You must be logged in to delete images.');
      return;
    }
  
    try {
      // Query Firestore to find the document with the specified `id` field
      const locationsRef = collection(firestore, 'locations');
      const q = query(locationsRef, where('id', '==', id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Extract the document ID from the query snapshot
        const documentId = querySnapshot.docs[0].id; // Assuming only one document matches
  
        // Delete the image from Firestore
        const imageDocRef = doc(firestore, `locations/${documentId}/images`, imageId);
        await deleteDoc(imageDocRef);
        console.log('Image deleted from Firestore');
  
        
  
        // Refresh the image list
        fetchImagesFromLocation(id);
      } else {
        console.log('No matching location document found!');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  
  
  

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Location Images</h1>
      {user && (
        <div className="mb-6">
          <Input type="file" onChange={handleUpload} disabled={uploading} />
          {uploading && <p>Uploading...</p>}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <img src={image.url} alt={image.name} className="w-full h-48 object-cover rounded" />
            {user && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleDelete(image.id, image.name)}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationImages;
