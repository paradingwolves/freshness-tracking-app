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

  const [formData, setFormData] = useState({
    editedQuantity: '',
    editedExpiryDate: '',
    editedUpdated: '',
  });

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
  
      if (isNaN(expiryDate)) {
        // Handle invalid date input
        console.error('Invalid expiry date');
        return;
      }
  
      // Set the time to midnight (00:00:00)
      expiryDate.setHours(0, 0, 0, 0);
  
      // Calculate the Unix timestamp based on the user-inputted date at midnight
      const expiryTimestamp = Math.floor(expiryDate.getTime() / 1000);
  
      // Parse the "editedUpdated" value to ensure it's a number
      const updatedValue = parseFloat(formData.editedUpdated);
  
      if (isNaN(updatedValue)) {
        // Handle invalid updated value
        console.error('Invalid updated value');
        return;
      }
  
      // Find the item with the largest expiry date
      const largestExpiryItem = matchingItems.reduce((prev, current) => {
        const currentExpiry = new Date(current.expiry_date * 1000);
        return currentExpiry > prev.expiry_date ? current : prev;
      });
  
      const newFormData = {
        name: largestExpiryItem.name,
        brand: largestExpiryItem.brand,
        quantity: formData.editedQuantity,
        updated: updatedValue, // Parse "updated" as a number
        expiry_date: expiryTimestamp, // Use the calculated timestamp
        item_number: largestExpiryItem.item_number,
        barcode_number: largestExpiryItem.barcode_number,
        animal: largestExpiryItem.animal,
      };
  
      const docRef = await addDoc(collection(db, 'Stock'), newFormData);
  
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
