import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Footer from './Footer';
import ExpireToday from '../ExpireToday/ExpireToday';
import ExpireThisWeek from '../ExpireThisWeek/ExpireThisWeek';


const Home = () => {
  return (
    <div>
      <Header />
      <ExpireToday />
      <ExpireThisWeek />
      <Footer />
    </div>
  )
}

export default Home;
