import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Loading from '../Loading/Loading';

// Function to format a timestamp as "mm/dd/yyyy"
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const EditStock = () => {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const itemRef = doc(db, 'Stock', id);
        const itemDoc = await getDoc(itemRef);
        if (itemDoc.exists()) {
          const item = itemDoc.data();
          setItemData(item);
        } else {
          console.error(`Item with ID ${id} not found.`);
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchItemData();
  }, [id]);

  return (
    <div>
      <Header />
      {itemData ? (
        <div>
          <p>Name: {itemData.name}</p>
          <p>Brand: {itemData.brand}</p>
          <p>Quantity: {itemData.quantity}</p>
          <p>Updated: {itemData.updated}</p>
          <p>Expiry Date: {formatDate(itemData.expiry_date)}</p> {/* Format the date here */}
          <p>Item Number: {itemData.item_number}</p>
          <p>Barcode Number: {itemData.barcode_number}</p>
          <p>Animal: {itemData.animal}</p>
          {/* Add more details here */}
        </div>
      ) : (
        <Loading />
      )}
      <Footer />
    </div>
  );
};

export default EditStock;
