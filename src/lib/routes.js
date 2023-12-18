import { createBrowserRouter, useParams } from "react-router-dom";
import React from "react";
import Home from "../components/Layout";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import AddStock from "../components/AddStock/AddStock";
import SeedData from "../components/SeedDB/SeedData";
import Login from "../components/Administrator/Login";
import ExpiredProducts from "../components/ExpiredProducts/ExpiredProducts";
import EditStock from "../components/EditStock/EditStock";
import AddBugReport from "../components/BugReports/AddBugReport";
import ViewBugReports from "../components/BugReports/ViewBugReports";

export const ROOT = "/";
export const ADD_STOCK = "/add_stock";
export const SEED_DATA = "/seed_data";
export const EXPIRED_PRODUCTS = "/expired_products";
export const LOGIN = "/login";
export const ADD_BUG_REPORT = "/add_bug_report";
export const VIEW_BUG_REPORTS = "/view_bug_reports";
export const EDIT_STOCK = "/edit_stock/:id";



// create routes
export const router = createBrowserRouter([
  { path: ROOT, element: <Home /> },
  { path: ADD_STOCK, element: <AddStock /> },
  { path: SEED_DATA, element: <SeedData /> },
  { path: EXPIRED_PRODUCTS, element: <ExpiredProducts /> },
  { path: LOGIN, element: <Login /> },
  { path: EDIT_STOCK, element: <EditStock /> },
  { path: ADD_BUG_REPORT, element: <AddBugReport /> },
  { path: VIEW_BUG_REPORTS, element: <ViewBugReports /> },
  { path: "*", element: <NotFound /> }
]);

function NotFound() {
  const backgroundStyle = {
    width: "100%",
    height: "100vh",
    backgroundImage: "url(../../media/cat.jpg)", 
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
    backgroundColor: "rgba(255, 255, 255, 0.65)", // White background color at 65% opacity
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

  return (
    <div>
      <Header />
      <div style={backgroundStyle}>
        <div style={overlayStyle}></div>
          <div style={{ padding: "5%", borderRadius: "10px" }}>
            <h1 style={headerStyle} className="groovy-font">Oops! You've wandered into the cat dimension.</h1>
            <p style={paragraphStyle} className="groovy-font">It seems you're not quite where you intended to be.</p>
            <p style={paragraphStyle} className="groovy-font">
              Don't worry, though! You can get back on track by{" "}
              <a href="/" className="text-warning">following my paw prints</a> or enjoy some cat time. 😺
            </p>
        </div>
      </div>
      <Footer />
    </div>
      
  );
}


export default router;
