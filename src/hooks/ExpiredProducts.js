import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { onSnapshot, collection } from 'firebase/firestore';
import { format, isBefore, startOfDay } from 'date-fns';

const useExpiredStockData = () => {
  const [expiredStockData, setExpiredStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Stock'), (snapshot) => {
      const today = startOfDay(new Date());

      const formattedData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          expiry_date: format(new Date(doc.data().expiry_date), 'MM/dd/yyyy'),
        }))
        .filter((item) => {
          const expiryDate = new Date(item.expiry_date);
          // Filter items with quantity greater than 0 and expiry date today or before today
          return item.quantity > 0 && isBefore(expiryDate, today);
        });

      setExpiredStockData(formattedData);
      setLoading(false);
    });

    // Cleanup by unsubscribing from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return { expiredStockData, loading };
};

export default useExpiredStockData;
