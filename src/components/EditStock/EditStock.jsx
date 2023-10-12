import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Loading from '../Loading/Loading';

const EditStock = () => {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const navigate = useNavigate();

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Create a date object from the input value (considering the user's timezone)
    const expiryDateInput = new Date(e.target.expiry_date.value);
    
    // Get the UTC timestamp by adding the timezone offset
    const expiryDate = expiryDateInput.getTime() + expiryDateInput.getTimezoneOffset() * 60000;
  
    try {
      const itemRef = doc(db, 'Stock', id);
      const newData = {
        name: e.target.name.value,
        brand: e.target.brand.value,
        quantity: e.target.quantity.value,
        updated: Number(e.target.updated.value),
        expiry_date: expiryDate,
        item_number: e.target.item_number.value,
        barcode_number: e.target.barcode_number.value,
        animal: e.target.animal.value,
      };
      await setDoc(itemRef, newData, { merge: true });
      navigate('/'); // Redirect to '/'
    } catch (error) {
      console.error('Error updating item data:', error);
    }
  };
  

  return (
    <div>
      <Header />
      {itemData ? (
        <div className="container">
          <form onSubmit={handleFormSubmit} className='my-2'>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold fs-5">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                defaultValue={itemData.name}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="brand" className="form-label fw-bold fs-5">
                Brand Name
              </label>
              <input
                type="text"
                className="form-control"
                id="brand"
                name="brand"
                defaultValue={itemData.brand}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="quantity" className="form-label fw-bold fs-5">
                Quantity in Stock
              </label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                name="quantity"
                defaultValue={itemData.quantity}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="expiry_date" className="form-label fw-bold fs-5">
                Expiry Date
              </label>
              <input
                type="date"
                className="form-control"
                id="expiry_date"
                name="expiry_date"
                defaultValue={
                  itemData.expiry_date
                    ? new Date(itemData.expiry_date).toISOString().split('T')[0]
                    : ''
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold fs-5">Stock Update Percentage</label>
              <select
                className="form-select"
                name="updated"
                defaultValue={itemData.updated}
                required
              >
                <option value="0">0%</option>
                <option value="1">20%</option>
                <option value="2">35%</option>
                <option value="3">50%</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="item_number" className="form-label fw-bold fs-5">
                Item Number
              </label>
              <input
                type="text"
                className="form-control"
                id="item_number"
                name="item_number"
                defaultValue={itemData.item_number}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="barcode_number" className="form-label fw-bold fs-5">
                Barcode Number
              </label>
              <input
                type="text"
                className="form-control"
                id="barcode_number"
                name="barcode_number"
                defaultValue={itemData.barcode_number}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="animal" className="form-label fw-bold fs-5">
                Animal Type
              </label>
              <select
                className="form-select"
                id="animal"
                name="animal"
                defaultValue={itemData.animal}
              >
                <option value="Cat">Cat</option>
                <option value="Dog">Dog</option>
                <option value="Small Animal">Small Animal</option>
                <option value="Bird">Bird</option>
                <option value="Fish">Fish</option>
                <option value="Reptile">Reptile</option>
              </select>
            </div>


            <div className="text-center mt-3">
              <button type="submit" className="btn btn-success fw-bold w-45 me-2">
                Save
              </button>
              <button
                type="button"
                className="btn btn-danger fw-bold w-45"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <Loading />
      )}
      <Footer />
    </div>
  );
};

export default EditStock;
