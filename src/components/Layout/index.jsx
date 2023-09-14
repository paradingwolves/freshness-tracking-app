import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Footer from './Footer';
import ExpireToday from '../ExpireToday/ExpireToday';
import ExpireThisWeek from '../ExpireThisWeek/ExpireThisWeek';
import StockTable from "../StockTable/StockTable";


const Home = () => {
  return (
    <div>
      <Header />
      <ExpireToday />
      <ExpireThisWeek />
      <StockTable />
      <Footer />
    </div>
  )
}

export default Home;
