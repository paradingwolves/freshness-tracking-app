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

  const {
    selectedItem,
    selectItem,
    clearSelectedItem,
    updateStockQuantity,
  } = useAddStock();

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
  const handleQuantityChange = (event) => {
    const newQuantity = event.target.value;
    updateStockQuantity(newQuantity);
  };

  return (
    <div>
      <Header />
      <div className="container bg-light p-4 rounded">
        <h1 className="text-dark fw-bold text-center">Add Inventory</h1>
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
        {selectedItem ? (
          <div>
            <h3>Selected Item:</h3>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={selectedItem.name}
                required
                disabled
              />
              {/* ... Include other input fields for the selected item */}
              <label className="form-label">Quantity</label>
              <input
                type="text"
                className="form-control"
                required
                value={selectedItem.quantity}
                onChange={handleQuantityChange}
              />
            </div>
          </div>
        ) : (
          <div>
            <h3>Matching Items:</h3>
            <form>
              {matchingItems.map((item, index) => (
                <div key={index} className="mb-3">
                  {/* Display matching items */}
                  {/* ... Include input fields for matching items */}
                  <button
                    className="btn mx-1 btn-rounded btn-success"
                    onClick={() => selectItem(item)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </form>
          </div>
        )}

        <button className="btn mx-1 btn-rounded btn-danger" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default AddStock;
