import React, { useState } from 'react';
import useStockSearchByWeek from '../../hooks/ExpireThisWeek';
import { Modal, Button } from 'react-bootstrap';
import useUpdateQuantityToZero from '../../hooks/RemoveStock'; 
import useIncrementUpdatedValue from '../../hooks/UpdateSticker';
import './ExpireThisWeek.css';

const ExpireThisWeek = () => {
  const { stockData, loading, setStockData } = useStockSearchByWeek();
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
    if (selectedProduct) {
      const { name, expiry_date } = selectedProduct;
      incrementUpdatedValue(name, expiry_date)
        .then(() => {
          console.log(`'Updated' value incremented for item: ${selectedProduct.expiry_date}`);
          removeProductFromStock(selectedProduct.id); // Remove the selected product
          setShowPopup(false);
        })
        .catch((error) => {
          console.error('Error incrementing updated value:', error);
        });
    }
  };

  const handleWrittenOffClick = () => {
    if (selectedProduct) {
      const { name, expiry_date } = selectedProduct;
      updateQuantityToZero(name, expiry_date)
        .then(() => {
          console.log(`Quantity updated to 0 for item: ${selectedProduct.expiry_date}`);
          removeProductFromStock(selectedProduct.id); // Remove the selected product
          setShowPopup(false);
        })
        .catch((error) => {
          console.error('Error updating quantity:', error);
        });
    }
  };

  const removeProductFromStock = (productId) => {
    // Create a new array without the selected product
    const updatedStockData = stockData.filter((product) => product.id !== productId);
    setStockData(updatedStockData); // Update your stockData state or API data
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
              <div key={product.id} className="card text-center mb-3">
                <button
                  className="close-button"
                  onClick={() => removeProductFromStock(product.id)}
                >
                  X
                </button>
                <div className="card-header">
                  <h4 className="card-title fw-bold">Expiring This Week!</h4>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li>
                      <strong>Name:</strong> {product.name}
                    </li>
                    <li>
                      <strong>Item Number:</strong> {product.item_number}
                    </li>
                    <li>
                      <strong>Expiry Date:</strong> {product.expiry_date}
                    </li>
                    <li>
                      <strong>Size:</strong> {product.size}
                    </li>
                    <li>
                      <strong>Quantity:</strong> {product.quantity}
                    </li>
                  </ul>
                </div>
                <div className="card-footer text-center">
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
              {selectedProduct && selectedProduct.updated < 3 && (
                <Button
                  variant="success"
                  className="mx-1"
                  onClick={handleRedStickerUpdatedClick}
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
