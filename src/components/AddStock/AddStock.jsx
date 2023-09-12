import React, { useEffect, useRef } from 'react';

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

    // Function to stop the camera stream when the component unmounts
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  return (
    <div>
      <h1>Camera Access Example</h1>
      <div>
        <video ref={videoRef} autoPlay playsInline muted />
      </div>
    </div>
  );
};

export default AddStock;
