import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const useMatchingStockData = (barcode) => {
  const [matchingItems, setMatchingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchingItems = async () => {
      try {
        const stockRef = collection(db, 'Stock');
        const q = query(stockRef, where('barcode_number', '==', Number(barcode)));
        const querySnapshot = await getDocs(q);

        const matchingItemsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMatchingItems(matchingItemsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matching items:', error);
        setLoading(false);
      }
    };

    if (barcode) {
      fetchMatchingItems();
    } else {
      // Reset matching items if barcode is empty
      setMatchingItems([]);
    }
  }, [barcode]);

  return { matchingItems, loading };
};

export default useMatchingStockData;
