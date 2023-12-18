import React, {useEffect, useState} from 'react';
import { viewBugReports } from "../../hooks/viewBugReports";
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import useAuth from '../../hooks/Admin';
import {auth} from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';


const ViewBugReports = () => {
    const [bugs, setBugs] = useState([]); // State to store fetched bugs

    const { user } = useAuth();
    const navigate = useNavigate();


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
      }, []);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Call the viewBugReports function to get the bugs data
            const bugsData = await viewBugReports();                     
            setBugs(bugsData);
          } catch (error) {
            console.error("Error fetching bugs:", error);
          }
        };
    
        fetchData();
      }, []); // Run only once on mount

      return (
        <div>
            <Header />
                <div className="container mt-5">
                    {bugs.map((bug) => (
                    <div key={bug.id} className="card mb-3">
                        <div className="row g-0">
                        <div className="col-md-4">
                            <img src={bug.image_url} className="img-fluid rounded-start" alt="Bug" />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                            <h5 className="card-title"><strong>Page: </strong>{bug.page}</h5>
                            <p className="card-text">
                                <strong>Description:</strong> {bug.description}
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                <Footer />
        </div>
      );
    };

export default ViewBugReports
