import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import useAuth from '../../hooks/Admin';
import Header from './Header';
import Footer from './Footer';
import ExpireToday from '../ExpireToday/ExpireToday';
import ExpireThisWeek from '../ExpireThisWeek/ExpireThisWeek';
import StockTable from "../StockTable/StockTable";


const Home = () => {
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
  return (
    <div>
      <Header />
      <ExpireThisWeek />
      <StockTable />
      <Footer />
    </div>
  )
}

export default Home;
