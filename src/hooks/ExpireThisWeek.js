import { useState, useEffect } from 'react';
import { db } from '../lib/firebase'; // Import Firebase configuration
import { onSnapshot, collection } from 'firebase/firestore';
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';

const useStockSearchByWeek = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Stock'), (snapshot) => {
      const currentDate = new Date();
      const startOfWeekDate = startOfWeek(currentDate);
      const endOfWeekDate = endOfWeek(currentDate);

      const formattedData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          expiry_date: format(new Date(doc.data().expiry_date), 'MM/dd/yyyy'),
        }))
        .filter((item) => {
          const itemDate = new Date(item.expiry_date);
          return isWithinInterval(itemDate, { start: startOfWeekDate, end: endOfWeekDate }) && item.quantity > 0;
        });

      setStockData(formattedData);
      setLoading(false);
    });

    // Cleanup by unsubscribing from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return { stockData, loading, setStockData  };
};

export default useStockSearchByWeek;
