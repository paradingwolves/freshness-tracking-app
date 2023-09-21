import { useState } from 'react';
import { db } from '../lib/firebase';
import { doc } from 'firebase/firestore';
import { query, collection, where, getDocs, updateDoc} from 'firebase/firestore';

const useUpdateQuantityToZero = () => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const updateQuantityToZero = async (name) => {
    try {
      setLoading(true);

      // Query Firestore to find documents with the matching name
      const q = query(collection(db, 'Stock'), where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        throw new Error(`Item with name '${name}' not found.`);
      }

      // Update the 'quantity' property to 0 for each matching document
      querySnapshot.forEach(async (item) => {
        const itemRef = doc(db, 'Stock', item.id);
        await updateDoc(itemRef, {
          quantity: 0
        });
      });

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { updateQuantityToZero, error, isLoading };
};

export default useUpdateQuantityToZero;
