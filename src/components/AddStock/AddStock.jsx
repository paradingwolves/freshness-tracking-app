import React, { useEffect, useRef } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const AddStock = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Function to start the camera stream
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera(); // Start the camera when the component mounts

    // Create a variable to hold the ref value
    const currentVideoRef = videoRef.current;

    // Function to stop the camera stream when the component unmounts
    return () => {
      if (currentVideoRef) {
        const stream = currentVideoRef.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  return (
    <div>
      <Header />
      <h1>Camera Access Example</h1>
      <div>
        <video ref={videoRef} autoPlay playsInline muted />
      </div>
      <Footer />
    </div>
  );
};

export default AddStock;
