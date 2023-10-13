import React, { useEffect, useRef, useState } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Quagga from 'quagga';
import Modal from 'react-modal';
import useMatchingStockData from '../../hooks/ScanStock';
import { db, auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/Admin';
import { collection, getDocs, addDoc, query, where, updateDoc } from 'firebase/firestore';
import './AddStock.css';

const AddStock = () => {
  const videoRef = useRef(null);
  const [detectedBarcode, setDetectedBarcode] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [stockData, setStockData] = useState([]);
 /*  const [searchBarcode, setSearchBarcode] = useState(''); */
  const [isAlertOpen, setIsAlertOpen] = useState(true); // Alert state
  const { matchingItems, startScanning, stopScanning } = useMatchingStockData(detectedBarcode);
  

  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    editedQuantity: '',
    editedExpiryDate: '',
    editedUpdated: '',
    editedSize: '',
    editedAnimal: '',
    editedBarcodeNumber: '',
    editedItemNumber: '',
    editedName: '',
    editedBrand: '',
  });

  const openModal = () => {
    setModalIsOpen(true);
    setIsAlertOpen(true);
    stopScanning();
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsAlertOpen(false);
    startScanning();
  };

  const handleSearch = () => {
    // Trigger a search by barcode_number action here
    if (detectedBarcode) {
      const sanitizedBarcode = detectedBarcode.startsWith('0') ? detectedBarcode.substring(1) : detectedBarcode;
      setDetectedBarcode(sanitizedBarcode);
      console.log(sanitizedBarcode);

      openModal();
    } else {
      // Show the barcode alert when the searchBarcode is empty
      /* setIsAlertOpen(true); */
    }
  };
  useEffect(() => {
    if (detectedBarcode) {
      setFormData({
        ...formData,
        editedBarcodeNumber: detectedBarcode,
      });
    }
  }, [detectedBarcode]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
  
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing rear camera:', error);
      } finally {
        if (matchingItems.length === 0) {
          setIsAlertOpen(true);
        }
      }
    };
  
    startCamera();
  }, [matchingItems]);
  

  useEffect(() => {
    if (scanningEnabled) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              width: { min: 640 },
              height: { min: 480 },
            },
            target: videoRef.current,
          },
          decoder: {
            readers: ['code_128_reader', 'ean_reader', 'upc_reader', 'code_39_reader'],
          },
        },
        (err) => {
          if (err) {
            console.error('QuaggaJS initialization error:', err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected(async (result) => {
        const barcodeValue = result.codeResult.code;
        const sanitizedBarcode = barcodeValue.startsWith('0') ? barcodeValue.substring(1) : barcodeValue;
        console.log('Detected barcode:', sanitizedBarcode);
        setDetectedBarcode(sanitizedBarcode);
        openModal();
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [scanningEnabled]);

  useEffect(() => {
    const fetchStockData = async () => {
      const stockRef = collection(db, 'Stock');
      const querySnapshot = await getDocs(stockRef);
      const stockDataArray = querySnapshot.docs.map((doc) => doc.data());
      setStockData(stockDataArray);
    };

    fetchStockData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Parse the user-inputted date string to a JavaScript Date object
      const expiryDate = new Date(formData.editedExpiryDate);
  
      if (isNaN(expiryDate.getTime())) {
        // Handle invalid date input
        console.error('Invalid expiry date');
        return;
      }
  
      // Add the EST timezone offset in minutes and convert it to milliseconds
      const timezoneOffsetMs = (expiryDate.getTimezoneOffset() + 300) * 60 * 1000; // 300 minutes = 5 hours
  
      // Adjust the date by adding the timezone offset
      expiryDate.setTime(expiryDate.getTime() + timezoneOffsetMs);
  
      // Set the time to midnight (00:00:00)
      expiryDate.setHours(0, 0, 0, 0);
  
      // Calculate the Unix timestamp based on the adjusted date at midnight
      const expiryTimestamp = expiryDate.getTime(); // Convert to milliseconds
  
      if (matchingItems.length > 0) {
        // Find the item with the largest expiry date
        const largestExpiryItem = matchingItems.reduce((prev, current) => {
          const currentExpiry = new Date(current.expiry_date * 1000);
          return currentExpiry > prev.expiry_date ? current : prev;
        });
  
        // Check if a document with the same item_number and expiry_date exists
        const stockRef = collection(db, 'Stock');
        const querySnapshot = await getDocs(
          query(
            stockRef,
            where('item_number', '==', largestExpiryItem.item_number),
            where('expiry_date', '==', expiryTimestamp)
          )
        );
  
        if (querySnapshot.size > 0) {
          // Document already exists, update its quantity by adding the new quantity
          querySnapshot.forEach(async (doc) => {
            const docRef = doc.data();
            const newQuantity =
              docRef.quantity + Number(formData.editedQuantity);
  
            // Update the quantity of the existing document
            await updateDoc(doc.ref, { quantity: newQuantity });
  
            console.log('Document updated with ID: ', doc.id);
            closeModal();
          });
        } else {
          // Document doesn't exist, add a new one
          const newFormData = {
            name: largestExpiryItem.name,
            brand: largestExpiryItem.brand,
            size: largestExpiryItem.size,
            quantity: Number(formData.editedQuantity), // Parse quantity as a number
            updated: Number(formData.editedUpdated), // Parse "updated" as a number
            expiry_date: expiryTimestamp, // Use the timestamp in milliseconds
            item_number: largestExpiryItem.item_number,
            barcode_number: largestExpiryItem.barcode_number,
            animal: largestExpiryItem.animal,
          };
  
          const docRef = await addDoc(stockRef, newFormData);
  
          console.log('Document written with ID: ', docRef.id);
          closeModal();
        }
      } else {
        // Handle the submission of the empty form by adding data to your database
        const stockRef = collection(db, 'Stock');
  
        const newFormData = {
          name: formData.editedName,
          brand: formData.editedBrand,
          size: formData.editedSize,
          quantity: Number(formData.editedQuantity), // Parse quantity as a number
          updated: Number(formData.editedUpdated), // Parse "updated" as a number
          expiry_date: expiryTimestamp, // Use the timestamp in milliseconds
          item_number: Number(formData.editedItemNumber),
          barcode_number: Number(formData.editedBarcodeNumber),
          animal: formData.editedAnimal,
        };
  
        const docRef = await addDoc(stockRef, newFormData);
  
        console.log('Document written with ID: ', docRef.id);
  
        // Clear the form data (optional)
        setFormData({
          editedName: '',
          editedBrand: '',
          editedQuantity: '',
          editedUpdated: '',
          editedExpiryDate: '',
          editedSize: '',
          editedItemNumber: '',
          editedBarcodeNumber: '',
          editedAnimal: '',
        });
  
        closeModal();
      }
    } catch (error) {
      console.error('Error adding/updating document: ', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container bg-dark my-3 p-4 rounded">
        <div className="my-container">
          <h1 className="my-title">Add Inventory</h1>
          <h5 className="my-subtitle">Scan Barcodes</h5>
          <video
            ref={videoRef}
            className="my-video rounded"
            autoPlay
            playsInline
            muted
          />
        </div>
        <div className="my-input-group">
          <input
            type="number"
            className="my-input"
            placeholder="Search by barcode number"
            value={detectedBarcode}
            onChange={(e) => setDetectedBarcode(e.target.value)}
          />
          <button className="btn btn-primary my-button" onClick={handleSearch}>
            Search
          </button>
        </div>

      </div>
      <Footer />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detected Barcode Modal"
      >
        <h3>Matching Item:</h3>
        <form>
          {matchingItems.length > 0 ? ( // Check if there are matching items
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={matchingItems[0].name}
                required
                disabled
              />
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-control"
                value={matchingItems[0].brand}
                required
                disabled
              />
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="editedQuantity"
                value={formData.editedQuantity}
                onChange={handleInputChange}
                required
              />
              <label className="form-label">Updated</label>
              <select
                className="form-select"
                name="editedUpdated"
                value={formData.editedUpdated}
                onChange={handleInputChange}
                required
              >
                <option value="0">0%</option>
                <option value="1">20%</option>
                <option value="2">35%</option>
                <option value="3">50%</option>
              </select>
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                name="editedExpiryDate"
                value={formData.editedExpiryDate}
                onChange={handleInputChange}
                required
              />
              <label className="form-label">Size</label>
              <input
                type="text"
                className="form-control"
                name="size"
                value={matchingItems[0].size}
                required
              />
              <label className="form-label">Item Number</label>
              <input
                type="text"
                className="form-control"
                value={matchingItems[0].item_number}
                required
                disabled
              />
              <label className="form-label">Barcode Number</label>
              <input
                type="text"
                className="form-control"
                value={matchingItems[0].barcode_number}
                required
                disabled
              />
              <div className="alert alert-danger alert-dismissible mt-2" role="alert">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => {
                    setIsAlertOpen(false); // Close the alert
                  }}
                ></button>
                Make Sure This Number Matches the Products Barcode Number
              </div>
              <label htmlFor="animal" className="form-label fw-bold fs-5">
                Animal Type
              </label>
              <select
                className="form-select"
                id="animal"
                name="animal"
                defaultValue={matchingItems[0].animal}
              >
                <option value="Cat">Cat</option>
                <option value="Dog">Dog</option>
                <option value="Small Animal">Small Animal</option>
                <option value="Bird">Bird</option>
                <option value="Fish">Fish</option>
                <option value="Reptile">Reptile</option>
              </select>
            </div>
          ) : (
            <div className="mb-3">
              {/* Render an empty form when no matching items */}
      
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="editedName"
                value={formData.editedName}
                onChange={handleInputChange}
                required
              />
              
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-control"
                name="editedBrand"
                value={formData.editedBrand}
                onChange={handleInputChange}
                required
              />
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="editedQuantity"
                value={formData.editedQuantity}
                onChange={handleInputChange}
                required
              />
              <label className="form-label">Updated</label>
              <select
                className="form-select"
                name="editedUpdated"
                value={formData.editedUpdated}
                onChange={handleInputChange}
                required
              >
                <option value="0">0%</option>
                <option value="1">20%</option>
                <option value="2">35%</option>
                <option value="3">50%</option>
              </select>
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                name="editedExpiryDate"
                value={formData.editedExpiryDate}
                onChange={handleInputChange}
                required
              />
              <label className="form-label">Size</label>
              <input
                type="text"
                className="form-control"
                name="editedSize"
                value={formData.editedSize}
                onChange={handleInputChange}
                required
              />
              <label className="form-label">Item Number</label>
              <input
                type="number"
                className="form-control"
                name="editedItemNumber"
                value={formData.editedItemNumber}
                onChange={handleInputChange}
                required
              />
             
              <label className="form-label">Barcode Number</label>
              <input
                type="number"
                className="form-control"
                name="editedBarcodeNumber"
                value={formData.editedBarcodeNumber}
                onChange={handleInputChange}
                required
              />
               {/* Updated the barcode_number input */}
               <div className="alert alert-danger alert-dismissible mt-2" role="alert">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => {
                    setIsAlertOpen(false); // Close the alert
                  }}
                ></button>
                Make Sure This Number Matches the Products Barcode Number
              </div>
              <label htmlFor="animal" className="form-label fw-bold fs-5">
                Animal Type
              </label>
              <select
                className="form-select"
                id="animal"
                name="animal"
                defaultValue={formData.animal}
              >
                <option value="Cat">Cat</option>
                <option value="Dog">Dog</option>
                <option value="Small Animal">Small Animal</option>
                <option value="Bird">Bird</option>
                <option value="Fish">Fish</option>
                <option value="Reptile">Reptile</option>
              </select>
              {/* Add other fields here */}
            </div>
          )}
        </form>

        <button className="btn mx-1 btn-rounded btn-success" onClick={handleSubmit} disabled={isAlertOpen}>
          Submit
        </button>
        <button className="btn mx-1 btn-rounded btn-danger" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default AddStock;
