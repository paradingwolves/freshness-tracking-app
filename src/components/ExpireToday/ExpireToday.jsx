import React, { useState } from 'react';

const ExpireToday = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title fw-bold text-center">Expiring Today!</h3>
          <p className="card-text">
            <strong>Name:</strong> Product Name<br />
            <strong>Description:</strong> Product Description<br />
            <strong>Expiry Date:</strong> MM/DD/YYYY<br />
            <strong>Size:</strong> Product Size<br />
            <strong>Quantity:</strong> Product Quantity<br />
          </p>
          <button
            className="btn btn-primary"
            onClick={handlePopupOpen}
            data-bs-toggle="modal"
            data-bs-target="#updateModal"
          >
            Updated
          </button>
        </div>
      </div>

      <div
        className={`modal fade ${showPopup ? 'show' : ''}`}
        id="updateModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="updateModalLabel"
        aria-hidden={!showPopup}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">Update Options</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handlePopupClose}
              ></button>
            </div>
            <div className="modal-body">
              <button
                type="button"
                className="btn mx-1 btn-success"
              >
                Red Sticker Updated
              </button>
              <button
                type="button"
                className="btn mx-1 btn-danger"
              >
                Product Written Off
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpireToday;
