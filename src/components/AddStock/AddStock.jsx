import React, { useEffect, useRef } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const AddStock = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Function to start the rear camera stream
    const startRearCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Request rear camera
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing rear camera:', error);
      }
    };

    startRearCamera(); // Start the rear camera when the component mounts

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
      <h1>Rear Camera Access Example</h1>
      <div>
        <video ref={videoRef} autoPlay playsInline muted />
      </div>
      <Footer />
    </div>
  );
};

export default AddStock;
