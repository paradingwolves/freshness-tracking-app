import React, { useEffect, useRef, useState } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Quagga from 'quagga';
import Modal from 'react-modal';
import useMatchingStockData from '../../hooks/ScanStock'; // Import the hook
import { db } from '../../lib/firebase'; // Import Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import useAddStock from '../../hooks/AddStock'; // Import the useAddStock hook

const AddStock = () => {
  const videoRef = useRef(null);
  const [detectedBarcode, setDetectedBarcode] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [scanningEnabled, setScanningEnabled] = useState(true); // Control scanner state
  const [stockData, setStockData] = useState([]); // State to hold Stock data
  const { matchingItems, startScanning, stopScanning } = useMatchingStockData(detectedBarcode); // Use the hook
  const { addStockItem, isLoading } = useAddStock(); // Use the useAddStock hook
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    quantity: 1,
    expiry_date: '',
    item_number: '',
    barcode_number_number: '',
    updated: '',
    animal: '',
    // Add more fields as needed
  });

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

  const handleSubmit = async () => {
    // Use matching stock data as the initial form data
    const matchingItem = matchingItems[0]; // Assuming there's only one matching item
    const formDataToUpdate = { ...formData };
    formDataToUpdate.name = matchingItem.name;
    formDataToUpdate.brand = matchingItem.brand;
    formDataToUpdate.quantity = matchingItem.quantity;
    formDataToUpdate.item_number = matchingItem.item_number;
    formDataToUpdate.barcode_number = matchingItem.barcode_number;
    formDataToUpdate.animal = matchingItem.animal;
    formDataToUpdate.updated = matchingItem.updated;
  
    // Convert the expiry_date to a Unix timestamp for midnight of that day
    if (formData.expiry_date) {
      const expiryDate = new Date(formData.expiry_date);
      if (!isNaN(expiryDate)) {
        expiryDate.setHours(0, 0, 0, 0); // Set time to midnight
        formDataToUpdate.expiry_date = expiryDate.getTime() / 1000;
      } else {
        console.error('Invalid expiry date format');
        return; // Prevent further execution if the date is invalid
      }
    }
  
    // Call the addStockItem function to add the item to Firebase
    const addedSuccessfully = await addStockItem(detectedBarcode, formDataToUpdate);
  
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
                required
                placeholder={item.quantity}
              />
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                required
              />
              <label className="form-label">Updated</label>
              <input
                type="number"
                className="form-control"
                placeholder={item.updated}
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
              {/* Add other fields as needed */}
            </div>
          ))}
        </form>
        {/* Add the submit button */}
        <button
          className="btn btn-rounded btn-success"
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
