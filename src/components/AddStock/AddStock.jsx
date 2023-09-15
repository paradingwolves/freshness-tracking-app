import React, { useEffect, useRef } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Quagga from 'quagga';

const AddStock = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Request rear camera
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

    Quagga.onDetected((result) => {
      // Handle detected barcodes here
      console.log('Detected barcodes:', result);
    });

    return () => {
      Quagga.stop();
    };
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddStock;
