import { createBrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "../components/Layout";

/* import Login from '../components/Administrator/Login';
import Layout from "../components/Layout/Home";
import TattooList from "../components/Portfolio/TattooList";
import About from "../components/About/About";
import Admin from "../components/Admin/Admin";
import Form from "../components/Contact/Form"; */

// home route 
export const ROOT = "/";




// create routes
export const router = createBrowserRouter([
  { path: ROOT, element: <Home /> },
 /*  { path: LOGIN, element: <Login /> },
  { path: PORTFOLIO, element: <TattooList /> },
  { path: ABOUT, element: <About /> },
  { path: ADMIN, element: <Admin /> },
  { path: CONTACT, element: <Form /> },
  { path: "*", element: <NotFound /> }, */ // Catch-all route for 404
]);

function NotFound() {
  const backgroundStyle = {
    width: "100%",
    height: "100vh",
    backgroundImage: "url(https://images.unsplash.com/photo-1506057278219-795838d4c2dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlwcGllfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60)", // Add your groovy 70's image URL
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  };

  const overlayStyle = {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 0, 0.65)", // Yellow background color at 65% opacity
    zIndex: -1,
  };

  const headerStyle = {
    fontSize: "2.5rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)", // Black text shadow
    marginBottom: "10px",
  };

  const paragraphStyle = {
    fontSize: "1.2rem",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)", // Black text shadow
    maxWidth: "400px",
    margin: "0 auto",
    marginBottom: "20px",
  };

  const yellowBoxStyle = {
    backgroundColor: "rgba(240, 191, 97, 0.65)", // Yellow background color at 65% opacity
    padding: "5%",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Black box shadow
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}></div>
      <div style={yellowBoxStyle}>
        <h1 style={headerStyle} className="groovy-font">Whoa! How'd you get here?</h1>
        <p style={paragraphStyle} className="groovy-font">That's not groovy, man. Head on back now.</p>
        <p style={paragraphStyle} className="groovy-font">
          You're clearly on a different wavelength. Get back to the vibe by{" "}
          <a href="/" className="text-warning">following the cosmic trail</a> or you'll be lost in time, man.
        </p>
      </div>
    </div>
  );
}

export default router;
