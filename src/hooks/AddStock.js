import { useState } from 'react';
import { db } from '../lib/firebase'; // Import Firebase configuration
import { collection, getDocs, addDoc, query, where, updateDoc, doc, increment } from 'firebase/firestore';

const useAddStock = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addStockItem = async (barcode, itemData) => {
    setIsLoading(true);

    try {
      const stockRef = collection(db, 'Stock');

      // Check if there is an item with the same item_number and expiry_date
      const matchingQuery = query(
        stockRef,
        where('item_number', '==', itemData.item_number),
        where('expiry_date', '==', itemData.expiry_date)
      );

      const matchingItemsSnapshot = await getDocs(matchingQuery);

      if (matchingItemsSnapshot.size > 0) {
        // If a matching item exists, update its quantity
        const matchingItemDoc = matchingItemsSnapshot.docs[0];
        await updateDoc(matchingItemDoc.ref, {
          quantity: increment(itemData.quantity),
        });
      } else {
        // If no matching item exists, add the new item
        await addDoc(stockRef, {
          ...itemData,
          expiry_date: new Date(itemData.expiry_date).setHours(0, 0, 0, 0), // Convert to Unix timestamp (midnight)
        });
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error adding stock item:', error);
      setIsLoading(false);
      return false;
    }
  };

  return {
    addStockItem,
    isLoading,
  };
};

export default useAddStock;
