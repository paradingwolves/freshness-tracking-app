import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Footer from './Footer';
import ExpireToday from '../ExpireToday/ExpireToday';


const Home = () => {
  return (
    <div>
      <Header />
      <ExpireToday />
      <Footer />
    </div>
  )
}

export default Home;
