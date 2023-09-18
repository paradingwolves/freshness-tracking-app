import React, { useState } from 'react';
import jsonData from './output2.json';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating unique IDs

const SeedData = () => {
  const [isLoading, setLoading] = useState(false);

  const seedCollection = async () => {
    setLoading(true);

    // Iterate through your JSON data and add each object as a document in the "Stock" collection
    for (const item of jsonData) {
      try {
        // Generate a unique ID for each document
        const id = uuidv4();

        // Create a reference to the document in the "Stock" collection
        const stockDocRef = doc(db, 'Stock', id);

        // Set the document data with the JSON item and additional properties (if needed)
        await setDoc(stockDocRef, {
          ...item,
        });

        console.log('Document added to "Stock" collection:', item);
      } catch (error) {
        console.error('Error adding document to "Stock" collection:', error);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Seed Firestore Collection with JSON Data</h1>
      <p>Click the button below to seed the "Stock" collection with JSON data:</p>
      <button onClick={seedCollection}>Seed Me</button>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default SeedData;
