import {
  getFirestore,
  collection,
  getDocs,

} from 'firebase/firestore';
import { app } from '../lib/firebase';

export const viewBugReports = async () => {
    const firestore = getFirestore(app);
    const collectionRef = collection(firestore, 'Bugs');
  
    try {
      console.log('Fetching bugs...');
      const querySnapshot = await getDocs(collectionRef);
      const bugsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched bugs:', bugsData);
      return bugsData;
    } catch (error) {
      /* console.error('Error fetching bugs:', error); */
      return [];
    }
};