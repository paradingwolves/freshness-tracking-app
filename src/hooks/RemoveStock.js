import { useState } from 'react';
import { db } from '../lib/firebase'; // Import your Firebase database instance
import { query, collection, where, getDocs, deleteDoc } from 'firebase/firestore';

const useRemoveItemByName = () => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const removeItemByName = async (name) => {
    try {
      setLoading(true);

      // Query Firestore to find documents with the matching name
      const q = query(collection(db, 'Stock'), where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        throw new Error(`Item with name '${name}' not found.`);
      }

      // Delete all documents with matching name
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { removeItemByName, error, isLoading };
};

export default useRemoveItemByName;
