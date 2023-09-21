import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { onSnapshot, collection } from 'firebase/firestore';
import { format } from 'date-fns';

const useAllStockData = () => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Stock'), (snapshot) => {
            const formattedData = snapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    expiry_date: format(new Date(doc.data().expiry_date), 'MM/dd/yyyy'),
                }))
                .filter((item) => item.quantity > 0); // Filter items with quantity greater than 0

            setStockData(formattedData);
            setLoading(false);
        });

        // Cleanup by unsubscribing from the snapshot listener when the component unmounts
        return () => unsubscribe();
    }, []);

    return { stockData, loading };
};

export default useAllStockData;
