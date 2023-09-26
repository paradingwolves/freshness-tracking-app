import React, { useEffect, useRef, useState } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Quagga from 'quagga';
import Modal from 'react-modal';
import useMatchingStockData from '../../hooks/ScanStock';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const AddStock = () => {
  const videoRef = useRef(null);
  const [detectedBarcode, setDetectedBarcode] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [stockData, setStockData] = useState([]);
  const { matchingItems, startScanning, stopScanning } = useMatchingStockData(detectedBarcode);

  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedExpiryDate, setEditedExpiryDate] = useState('');
  const [editedUpdated, setEditedUpdated] = useState('');

  const handleQuantityChange = (event) => {
    setEditedQuantity(event.target.value);
  };

  const handleExpiryDateChange = (event) => {
    setEditedExpiryDate(event.target.value);
  };

  const handleUpdatedChange = (event) => {
    setEditedUpdated(event.target.value);
  };

  const openModal = () => {
    setModalIsOpen(true);
    stopScanning();
  };

  const closeModal = () => {
    setModalIsOpen(false);
    startScanning();
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

  const handleSubmit = async () => {
    try {
      // Parse the user-inputted date string to a JavaScript Date object
      const expiryDate = new Date(editedExpiryDate);
  
      if (isNaN(expiryDate)) {
        // Handle invalid date input
        console.error('Invalid expiry date');
        return;
      }
  
      // Set the time to midnight (00:00:00)
      expiryDate.setHours(0, 0, 0, 0);
  
      // Parse the "updated" value to ensure it's a number
      const updatedValue = parseFloat(editedUpdated);
  
      if (isNaN(updatedValue)) {
        // Handle invalid updated value
        console.error('Invalid updated value');
        return;
      }
  
      const formData = {
        name: matchingItems[0].name,
        brand: matchingItems[0].brand,
        quantity: editedQuantity,
        updated: updatedValue, // Parse "updated" as a number
        // Calculate the Unix timestamp based on the user-inputted date at midnight
        expiry_date: Math.floor(expiryDate.getTime() / 1000), // Convert to Unix timestamp
        item_number: matchingItems[0].item_number,
        barcode_number: matchingItems[0].barcode_number,
        animal: matchingItems[0].animal,
      };
  
      const docRef = await addDoc(collection(db, 'Stock'), formData);
  
      console.log('Document written with ID: ', docRef.id);
      closeModal();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  

  return (
    <div>
      <Header />
      <div className="container bg-light p-4 rounded">
        <h1 className='text-dark fw-bold text-center'>Add Inventory</h1>
        <div className="text-center my-3">
          <h5 className="fw-bold text-dark">Scan Barcodes</h5>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ maxWidth: '100%' }}
          />
        </div>
      </div>
      <Footer />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detected Barcode Modal"
      >
        <h3>Matching Items:</h3>
        <form>
          {matchingItems.map((item, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={item.name}
                required
                disabled
              />
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-control"
                value={item.brand}
                required
                disabled
              />
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={editedQuantity}
                onChange={handleQuantityChange}
                required
              />
              <label className="form-label">Updated</label>
              <input
                type="number"
                className="form-control"
                value={editedUpdated}
                onChange={handleUpdatedChange}
                required
              />
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                value={editedExpiryDate}
                onChange={handleExpiryDateChange}
                required
              />
              <label className="form-label">Item Number</label>
              <input
                type="text"
                className="form-control"
                value={item.item_number}
                required
                disabled
              />
              <label className="form-label">Barcode Number</label>
              <input
                type="text"
                className="form-control"
                value={item.barcode_number}
                required
                disabled
              />
              <label className="form-label">Animal</label>
              <input
                type="text"
                className="form-control"
                value={item.animal}
                required
                disabled
              />
            </div>
          ))}
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
