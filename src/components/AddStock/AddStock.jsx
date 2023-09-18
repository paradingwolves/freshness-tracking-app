import React, { useEffect, useRef, useState } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Quagga from 'quagga';
import Modal from 'react-modal';
import { db } from '../../lib/firebase'; // Import Firebase configuration
import { collection, query, where, getDocs} from 'firebase/firestore';

const AddStock = () => {
  const videoRef = useRef(null);
  const [detectedBarcode, setDetectedBarcode] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [matchingItems, setMatchingItems] = useState([]); // State to hold matching items
  const [scanningEnabled, setScanningEnabled] = useState(true); // Control scanner state

  const openModal = () => {
    setModalIsOpen(true);
    // Disable scanning when the modal is open
    setScanningEnabled(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    // Re-enable scanning when the modal is closed
    setScanningEnabled(true);
    // Clear matching items when modal is closed
    setMatchingItems([]);
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

        // Fetch matching items from Firestore based on barcode_number
        const stockRef = collection(db, 'Stock');
        const q = query(stockRef, where('barcode_number', '==', sanitizedBarcode));
        const querySnapshot = await getDocs(q);

        const matchingItemsData = querySnapshot.docs.map((doc) => doc.data());
        setMatchingItems(matchingItemsData);
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [scanningEnabled]);

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

        {/* Display matching items */}
        <h3>Matching Items:</h3>
        <ul>
          {matchingItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>

        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default AddStock;
