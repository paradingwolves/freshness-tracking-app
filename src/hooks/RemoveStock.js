import { useState } from 'react';
import { db } from '../lib/firebase';
import { doc } from 'firebase/firestore';
import { query, collection, where, getDocs, updateDoc } from 'firebase/firestore';

const useUpdateQuantityToZero = () => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // Function to convert MM/DD/YYYY date format to Unix timestamp
 // Function to convert MM/DD/YYYY date format to Unix timestamp in milliseconds
  const dateToUnixTimestamp = (dateString) => {
    const [month, day, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    return date.getTime(); // Convert to Unix timestamp in milliseconds
  };


  const updateQuantityToZero = async (name, expiryDate) => {
    try {
      setLoading(true);

      // Convert expiryDate to Unix timestamp
      const expiryTimestamp = dateToUnixTimestamp(expiryDate);
      console.log(expiryTimestamp);

      // Query Firestore to find documents with matching name and expiry_date
      const q = query(
        collection(db, 'Stock'),
        where('name', '==', name),
        where('expiry_date', '==', expiryTimestamp)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        throw new Error(`Item with name '${name}' and expiry_date '${expiryDate}' not found.`);
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
