import React, { useEffect, useRef, useState } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import {QrReader} from 'react-qr-reader';

const AddStock = () => {
  const videoRef = useRef(null);
  const [result, setResult] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (error) => {
    console.error('Error accessing camera:', error);
  };

  return (
    <div>
      <Header />
      <div className="container bg-info">
        <h1 className="text-dark fw-bold text-center">Rear Camera Access Example</h1>
        <div>
          <h5 className="fw-bold text-center text-white">Scan Bar Code</h5>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <h3>Result:</h3>
          {result && <p>{result}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddStock;
