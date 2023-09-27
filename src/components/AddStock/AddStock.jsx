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
  const [searchBarcode, setSearchBarcode] = useState('');
  const { matchingItems, startScanning, stopScanning } = useMatchingStockData(detectedBarcode);

  const { user } = useAuth();
  const navigate = useNavigate();



  // Use useEffect to log user information after the initial render
  useEffect(() => {
    const checkUserAuth = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("signed in admin", user.uid);
        } else {
          navigate('/login');
        }
      });

      return () => unsubscribe();
    };

    checkUserAuth();
  }, []);
  

  const [formData, setFormData] = useState({
    editedQuantity: '',
    editedExpiryDate: '',
    editedUpdated: '',
    editedSize: '',
  });

  const openModal = () => {
    setModalIsOpen(true);
    stopScanning();
  };

  const closeModal = () => {
    setModalIsOpen(false);
    startScanning();
  };
  const handleSearch = () => {
    // Trigger a search by barcode_number action here
    if (searchBarcode) {
      const sanitizedBarcode = searchBarcode.startsWith('0') ? searchBarcode.substring(1) : searchBarcode;
      setDetectedBarcode(sanitizedBarcode);
      openModal();
    }
  };

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
      }
    };

    startCamera();
  }, []);

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
            docRef.quantity + parseFloat(formData.editedQuantity);
  
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
          quantity: parseFloat(formData.editedQuantity), // Parse quantity as a number
          updated: parseFloat(formData.editedUpdated), // Parse "updated" as a number
          expiry_date: expiryTimestamp, // Use the timestamp in milliseconds
          item_number: largestExpiryItem.item_number,
          barcode_number: largestExpiryItem.barcode_number,
          animal: largestExpiryItem.animal,
        };
  
        const docRef = await addDoc(stockRef, newFormData);
  
        console.log('Document written with ID: ', docRef.id);
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
            value={searchBarcode}
            onChange={(e) => setSearchBarcode(e.target.value)}
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
          {/* Display details for the first matching item */}
          {matchingItems.length > 0 && (
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
              <input
                type="number"
                className="form-control"
                name="editedUpdated"
                value={formData.editedUpdated}
                onChange={handleInputChange}
                required
              />
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
              <label className="form-label">Animal</label>
              <input
                type="text"
                className="form-control"
                value={matchingItems[0].animal}
                required
                disabled
              />
            </div>
          )}
        </form>

        <button className="btn mx-1 btn-rounded btn-success" onClick={handleSubmit}>
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
