import React from 'react';
import ReactDOM from 'react-dom/client';
import Framework7 from 'framework7/lite-bundle';
import Framework7React from 'framework7-react';
import App from './App';

Framework7.use(Framework7React);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


