import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig'; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
const LocationDetail = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);


  useEffect(() => {
    const fetchLocation = async () => {
      const locationRef = doc(firestore, 'locations', id);
      const locationSnapshot = await getDoc(locationRef);
  
      if (locationSnapshot.exists()) {
        setLocation({ id: locationSnapshot.id, ...locationSnapshot.data() });
      } else {
        console.log('Location not found');
      }
  
      const imagesRef = collection(locationRef, 'images');
      const imagesSnapshot = await getDocs(imagesRef);
      const imagesList = imagesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(imagesList);
    };
  
    fetchLocation();
  }, [id]);

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteDoc(doc(firestore, 'locations', id, 'images', imageId));
      setImages(images.filter((image) => image.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setNewImageFile(file);
  };
  const handleUploadImageFile = async () => {
    const file = newImageFile;
    if (file) {
      try {
        const imagesRef = collection(doc(firestore, 'locations', id), 'images');
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // You can track the upload progress here if needed
          },
          (error) => {
            console.error('Error uploading image:', error);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(imagesRef, { url: downloadUrl });
            setNewImageFile(null);
          }
        );
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };


  const handleUploadImage = async () => {
    if (newImageUrl.trim()) {
      try {
        const imagesRef = collection(doc(firestore, 'locations', id), 'images');
        await addDoc(imagesRef, { url: newImageUrl });
        setNewImageUrl('');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div>
      {location && (
        <Card>
          <CardHeader>
            <CardTitle>{location.name}</CardTitle>
            <CardDescription>
              Country: {location.country} | Location Type: {location.locationType}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="newImageUrl">Upload New Image</Label>
              <Input
                id="newImageUrl"
                placeholder="Enter image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Button onClick={handleUploadImage}>Upload</Button>
            </div>
            <div>
              <Label htmlFor="newImageUpload">Upload New Image File</Label>
              <Input
                id="newImageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button onClick={handleUploadImageFile}>Upload</Button>
            </div>
            {images.length > 0 ? (
              images.map((image) => (
                <Card key={image.id}>
                  <img style={{height:'200px',width:'200px'}} src={image.url} alt={image.name} />
                  <Button variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                    Delete
                  </Button>
                </Card>
              ))
            ) : (
              <Card>
                <CardDescription>No images uploaded. Please upload images.</CardDescription>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationDetail;