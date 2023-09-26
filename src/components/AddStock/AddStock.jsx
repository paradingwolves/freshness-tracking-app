import React, { useEffect, useRef, useState } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Quagga from 'quagga';
import Modal from 'react-modal';
import useMatchingStockData from '../../hooks/ScanStock'; // Import the hook
import { db } from '../../lib/firebase'; // Import Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import useAddStock from '../../hooks/AddStock';

const AddStock = () => {
  const videoRef = useRef(null);
  const [detectedBarcode, setDetectedBarcode] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [scanningEnabled, setScanningEnabled] = useState(true); // Control scanner state
  const [stockData, setStockData] = useState([]); // State to hold Stock data
  const { matchingItems, startScanning, stopScanning } = useMatchingStockData(detectedBarcode); // Use the hook
  const { addStockItem, isLoading } = useAddStock(); // Initialize the useAddStock custom hook

  const openModal = () => {
    setModalIsOpen(true);
    // Disable scanning when the modal is open
    stopScanning();
  };

  const closeModal = () => {
    setModalIsOpen(false);
    // Re-enable scanning when the modal is closed
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

        // Open the modal when a barcode is detected
        openModal();
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [scanningEnabled]);

  useEffect(() => {
    // Fetch Stock data from Firestore
    const fetchStockData = async () => {
      const stockRef = collection(db, 'Stock');
      const querySnapshot = await getDocs(stockRef);
      const stockDataArray = querySnapshot.docs.map((doc) => doc.data());
      setStockData(stockDataArray);
    };

    fetchStockData();
  }, []);

  // Create a function to handle form submission
  const handleSubmit = async () => {
    // Extract form data here (replace with actual form data extraction)
    const formData = {
      name: 'Item Name',
      brand: 'Item Brand',
      quantity: 1,
      expiry_date: '2023-12-31',
      item_number: '12345',
      barcode_number: detectedBarcode,
      animal: 'Animal Type',
    };

    // Call the addStockItem function to add the item to Firebase
    const addedSuccessfully = await addStockItem(detectedBarcode, formData);

    if (addedSuccessfully) {
      // Optionally, you can show a success message or clear the form here
      console.log('Item added successfully');
    } else {
      // Handle the error or display an error message
      console.error('Failed to add item');
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
        {/* Display matching items or Stock data */}
        <h3>Matching Items:</h3>
        <form>
          {matchingItems.map((item, index) => (
            <div key={index} className="mb-3">
              {/* ... (previous code for displaying matching items) */}
            </div>
          ))}
        </form>

        {/* Add the submit button */}
        <button
          className="btn btn-primary mt-3"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Submit'}
        </button>

        <button className="btn btn-rounded btn-danger" onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default AddStock;
