import { useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, query, collection, where, getDocs, updateDoc } from 'firebase/firestore';

const useIncrementUpdatedValue = () => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // Function to convert MM/DD/YYYY date format to Unix timestamp in milliseconds
  const dateToUnixTimestamp = (dateString) => {
    const [month, day, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    return date.getTime(); // Convert to Unix timestamp in milliseconds
  };

  const incrementUpdatedValue = async (name, expiryDate) => {
    try {
      setLoading(true);

      // Convert expiryDate to Unix timestamp
      const expiryTimestamp = dateToUnixTimestamp(expiryDate);

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

      // Increment the 'updated' property by 1 for each matching document
      querySnapshot.forEach(async (item) => {
        const itemData = (await getDoc(doc(db, 'Stock', item.id))).data();
        const updatedValue = typeof itemData.updated === 'number' ? itemData.updated + 1 : 1;

        // Increment the 'updated' field by 1
        await updateDoc(doc(db, 'Stock', item.id), {
          updated: updatedValue,
        });
      });

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { incrementUpdatedValue, error, isLoading };
};

export default useIncrementUpdatedValue;
