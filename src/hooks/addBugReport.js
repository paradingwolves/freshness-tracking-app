import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { app, storage } from '../lib/firebase';
  
  const addBugReport = async (newBug) => {
    try {
      const firestore = getFirestore(app);
      const collectionRef = collection(firestore, 'Bugs');
  
      // Add timestamp to the newBug
      newBug.date = serverTimestamp();
  
      // Upload the image if it exists
      if (newBug.image) {
        const storageRef = ref(storage, 'Bugs/' + newBug.image.name);
        await uploadBytes(storageRef, newBug.image);
  
        // Update the newBug with the image URL
        newBug.image_url = await getDownloadURL(storageRef);
  
        // Remove the image field from the newBug to avoid duplication
        delete newBug.image;
      }
  
      // Add the newBug to the 'projects' collection in Firestore
      await addDoc(collectionRef, newBug);
  
      return true;
    } catch (error) {
      console.error('Error adding project:', error);
      return false;
    }
  };
  
  export default addBugReport;