import React, { useEffect, useState } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import { useNavigate } from 'react-router-dom';
import useExpiredStockData from '../../hooks/ExpiredProducts';
import useUpdateQuantityToZero from '../../hooks/RemoveStock';
import { auth } from '../../lib/firebase';
import useAuth from '../../hooks/Admin';
import './ExpiredProduct.css';
import MiniGame from './MiniGame';

const ExpiredProducts = () => {
  const { expiredStockData, loading } = useExpiredStockData();
  const { updateQuantityToZero, isLoading: updateLoading } = useUpdateQuantityToZero();
  const { user } = useAuth();
  const navigate = useNavigate();


  // Use useEffect to log user information after the initial render
  useEffect(() => {
    const checkUserAuth = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("signed in admin", user.uid);
        } else {
          navigate('/login');
        }
      });

      return () => unsubscribe();
    };

    checkUserAuth();
  }, []); // Empty dependency array to run the effect only once

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
          <div className="row">
            <div className="col-4"></div>
            <div className="col-4">
              <img className="justify-content-center" src="media/Loading.gif" alt="Loading..." />
            </div>
            <div className="col-4"></div>
          </div>
        ) : (
          expiredStockData.length === 0 ? (
            <p className='text-center'>No products to display. We aim to keep our inventory fresh. Please remember to sell any items marked with red stickers promptly.
            <img src="https://gifdb.com/images/high/mike-myers-thumbs-up-meme-wayne-s-world-k6mc60kkfiux96uc.gif" className='good-work-gif' alt="Great Work!" />
            <MiniGame /></p>
          ) : (
            <div className="table-responsive">
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
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ExpiredProducts;
