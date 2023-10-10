import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { collection, getDoc, doc } from 'firebase/firestore'; // Import Firebase Firestore functions
import { db } from '../../lib/firebase'; // Import your Firebase configuration
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Loading from '../Loading/Loading';

const EditStock = () => {
  const { id } = useParams(); // Get the 'id' parameter from the URL

  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    // Fetch the item's data based on the 'id' parameter
    const fetchItemData = async () => {
      try {
        const itemRef = doc(db, 'Stock', id); // Assuming 'Stock' is your collection name
        const itemDoc = await getDoc(itemRef);
        if (itemDoc.exists()) {
          const item = itemDoc.data();
          setItemData(item);
        } else {
          // Handle the case where the item with the given ID doesn't exist
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
      {!itemData ? (
        <div>
          <p>Name: {itemData.name}</p>
          <p>Brand: {itemData.brand}</p>
          <p>Quantity: {itemData.quantity}</p>
          <p>Updated: {itemData.updated}</p>
          <p>Expiry Date: {itemData.expiry_date}</p>
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
