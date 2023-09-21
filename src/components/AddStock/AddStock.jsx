import React, { useEffect, useRef, useState } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Quagga from 'quagga';
import Modal from 'react-modal';
import useMatchingStockData from '../../hooks/ScanStock'; // Import the hook
import { db } from '../../lib/firebase'; // Import Firebase configuration
import { collection, getDocs } from 'firebase/firestore';

const AddStock = () => {
  const videoRef = useRef(null);
  const [detectedBarcode, setDetectedBarcode] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [scanningEnabled, setScanningEnabled] = useState(true); // Control scanner state
  const [stockData, setStockData] = useState([]); // State to hold Stock data
  const { matchingItems, startScanning, stopScanning } = useMatchingStockData(detectedBarcode); // Use the hook

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

  return (
    <div>
      <Header />
      <div className="container bg-info">
        <h1 className='text-dark fw-bold text-center'>Rear Camera Barcode Scanner</h1>
        <div>
          <h5 className="fw-bold text-center text-white">Scan Barcodes</h5>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ maxWidth: '100%' }}
          />
          {detectedBarcode && (
            <div className="text-center mt-3">
              <p>Detected Barcode: {detectedBarcode}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detected Barcode Modal"
      >
        <h2>Detected Barcode</h2>
        <p>Item Number: {detectedBarcode}</p>

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
          type="text"
          className="form-control"
          required
          value={item.quantity}
        />
        <label className="form-label">Expiry Date</label>
        <input
          type="date"
          className="form-control"
          required
          value={item.expiry_date}
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
        <label className="form-label">Updated</label>
        <input
          type="text"
          className="form-control"
          value="0"
          required
          disabled
        />
      </div>
    ))}
  </form>


        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default AddStock;
