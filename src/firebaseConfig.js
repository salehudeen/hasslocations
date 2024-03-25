import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth";
const firebaseConfig = {
  // ... your Firebase project configuration options
  apiKey: "AIzaSyBMTwJSmBBY5hIv9BQm30la97403ZI18vE",
  authDomain: "hass-locations.firebaseapp.com",
  projectId: "hass-locations",
  storageBucket: "hass-locations.appspot.com",
  messagingSenderId: "611211144554",
  appId: "1:611211144554:web:2675b8a79c3b22f83b8913",
  measurementId: "G-MBYJVJGJK5"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get individual Firebase service instances
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Export the individual service instances
export { auth, firestore, storage };
