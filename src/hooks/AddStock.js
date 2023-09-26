import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const useAddStock = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addStockItem = async (barcode, formData) => {
    setIsLoading(true);

    try {
      const { name, brand, quantity, expiry_date, item_number, animal } = formData;
      const timestamp = new Date(expiry_date + 'T00:00:00').getTime() / 1000; // Convert to Unix timestamp

      // Check if an item with the same item_number and expiry_date exists
      const stockRef = collection(db, 'Stock');
      const stockQuery = query(stockRef, where('item_number', '==', item_number), where('expiry_date', '==', timestamp));
      const stockQuerySnapshot = await getDocs(stockQuery);

      if (stockQuerySnapshot.size > 0) {
        // Item already exists, update its quantity
        const stockDoc = stockQuerySnapshot.docs[0];
        await updateDoc(stockDoc.ref, {
          quantity: stockDoc.data().quantity + parseInt(quantity),
        });
      } else {
        // Item doesn't exist, add it
        await addDoc(collection(db, 'Stock'), {
          name,
          brand,
          quantity: parseInt(quantity),
          expiry_date: timestamp,
          item_number,
          animal,
          barcode_number: barcode,
          // Add other item properties as needed
        });
      }

      setIsLoading(false);
      return true; // Successfully added or updated item
    } catch (error) {
      console.error('Error adding item to Stock:', error);
      setIsLoading(false);
      return false; // Failed to add or update item
    }
  };

  return { addStockItem, isLoading };
};

export default useAddStock;
