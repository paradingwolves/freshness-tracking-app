import React, { useEffect } from 'react';
import useAuth from '../../hooks/Admin';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const Login = () => {
  const redirectToAdmin = () => {
    // Redirect to "/" upon successful login
    window.location.href = '/';
  };

  const { user, email, setEmail, password, setPassword, error, handleLogin } = useAuth();

  useEffect(() => {
    // Check if the user is already signed in
    if (user) {
      redirectToAdmin();
    }
  }, [user]);

  return (
    <div> 
      <Header />
      <div id="contact" className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">Login</h5>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </div>
    
  );
};

export default Login;
