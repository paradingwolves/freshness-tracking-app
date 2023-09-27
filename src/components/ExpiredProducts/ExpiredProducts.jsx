import React from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import useExpiredStockData from '../../hooks/ExpiredProducts';
import useUpdateQuantityToZero from '../../hooks/RemoveStock';
import './ExpiredProduct.css';

const ExpiredProducts = () => {
  const { expiredStockData, loading } = useExpiredStockData();
  const { updateQuantityToZero, isLoading: updateLoading } = useUpdateQuantityToZero();

  const handleRemoveProduct = async (name, expiryDate) => {
    // Call the hook to update quantity to zero
    await updateQuantityToZero(name, expiryDate);
  };

  return (
    <div>
      <Header />
      <div className="container bg-light p-4 rounded">
        <h1 className="text-dark fw-bold text-center">Expired Products</h1>
        {loading ? (
          <img src="https://i.pinimg.com/originals/d0/e3/ca/d0e3ca45bb78d6cf92bb88aaefdc020e.gif" alt="Loading..." />
        ) : (
          expiredStockData.length === 0 ? (
            <p className='text-center'>No products to display. We aim to keep our inventory fresh. Please remember to sell any items marked with red stickers promptly.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiredStockData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td>{item.quantity}</td>
                    <td>{item.expiry_date}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveProduct(item.name, item.expiry_date)}
                        disabled={updateLoading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ExpiredProducts;
