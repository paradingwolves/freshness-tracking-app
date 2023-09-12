import React, { useState } from 'react';
import useStockSearch from '../../hooks/ExpireToday';
import { Modal, Button } from 'react-bootstrap';

const ExpireToday = () => {
  const { stockData, loading } = useStockSearch();
  const [showPopup, setShowPopup] = useState(false);
  const [ setSelectedProduct] = useState(null);

  const handlePopupOpen = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setSelectedProduct(null);
    setShowPopup(false);
  };

  return (
    <div className="container my-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {stockData.length === 0 ? (
            <p>No products are expiring today.</p>
          ) : (
            stockData.map((product) => (
              <div key={product.id} className="card mb-3">
                <div className="card-body">
                  <h3 className="card-title fw-bold text-center">Expiring Today!</h3>
                  <p className="card-text">
                    <strong>Name:</strong> {product.name}<br />
                    <strong>Description:</strong> {product.description}<br />
                    <strong>Item Number:</strong> {product.item_number}<br />
                    <strong>Expiry Date:</strong> {product.expiry_date}<br />
                    <strong>Size:</strong> {product.size}<br />
                    <strong>Quantity:</strong> {product.quantity}<br />
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handlePopupOpen(product)}
                  >
                    Updated
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      <Modal show={showPopup} onHide={handlePopupClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {stockData.length > 0 && (
            <>
              <Button variant="success" className="mx-1">
                Red Sticker Updated
              </Button>
              <Button variant="danger" className="mx-1">
                Product Written Off
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ExpireToday;
