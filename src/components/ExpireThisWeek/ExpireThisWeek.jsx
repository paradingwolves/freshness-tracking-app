import React, { useState } from 'react';
import useStockSearchByWeek from '../../hooks/ExpireThisWeek';
import { Modal, Button } from 'react-bootstrap';
import useUpdateQuantityToZero from '../../hooks/RemoveStock'; 
import useIncrementUpdatedValue from '../../hooks/UpdateSticker';

const ExpireThisWeek = () => {
  const { stockData, loading } = useStockSearchByWeek();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { updateQuantityToZero } = useUpdateQuantityToZero(); // Use the custom hook
  const { incrementUpdatedValue } = useIncrementUpdatedValue(); // Use the custom hook

  const handlePopupOpen = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setSelectedProduct(null);
    setShowPopup(false);
  };

  const handleRedStickerUpdatedClick = () => {
    // Add the code here to handle the "Red Sticker Updated" functionality
    if (selectedProduct) {
      const { name, expiry_date } = selectedProduct; // Use both name and expiry_date
      incrementUpdatedValue(name, expiry_date)
        .then(() => {
          console.log(`'Updated' value incremented for item: ${selectedProduct.expiry_date}`);
          setShowPopup(false); // Close the modal after updating
        })
        .catch((error) => {
          console.error('Error incrementing updated value:', error);
        });
    }
  };

  const handleWrittenOffClick = () => {
    // Add the code here to handle the "Product Written Off" functionality
    if (selectedProduct) {
      const { name, expiry_date } = selectedProduct; // Use both name and expiry_date
      updateQuantityToZero(name, expiry_date)
        .then(() => {
          console.log(`Quantity updated to 0 for item: ${selectedProduct.expiry_date}`);
          setShowPopup(false); // Close the modal after updating
        })
        .catch((error) => {
          console.error('Error updating quantity:', error);
        });
    }
  };

  return (
    <div className="container my-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {stockData.length === 0 ? (
            <p>No products are expiring this week.</p>
          ) : (
            stockData.map((product) => (
              <div key={product.id} className="card mb-3">
                <div className="card-body">
                  <h3 className="card-title fw-bold text-center">Expiring This Week!</h3>
                  <p className="card-text">
                    <strong>Name:</strong> {product.name}<br />
                    <strong>Description:</strong> {product.description}<br />
                    <strong>Item Number:</strong> {product.item_number}<br />
                    <strong>Expiry Date:</strong> {product.expiry_date}<br />
                    <strong>Size:</strong> {product.size}<br />
                    <strong>Quantity:</strong> {product.quantity}<br />
                  </p>
                  {product.updated < 3 && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePopupOpen(product)}
                    >
                      Updated
                    </button>
                  )}
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
              {selectedProduct && selectedProduct.updated < 3 && (
                <Button
                  variant="success"
                  className="mx-1"
                  onClick={handleRedStickerUpdatedClick} // Call the new function here
                >
                  Red Sticker Updated
                </Button>
              )}
              <Button
                variant="danger"
                className="mx-1"
                onClick={handleWrittenOffClick}
              >
                Product Written Off
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ExpireThisWeek;
