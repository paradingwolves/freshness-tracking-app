import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const useAuth = (onLoginSuccess) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Check if the user is already signed in when the hook mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Redirect to homepage if the user is already signed in
       /*  redirectToHomepage(); */
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // User logged in successfully
      const user = userCredential.user;
      setUser(user);
      console.log('Logged in user:', user.uid);

      // Call the onLoginSuccess callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Redirect to homepage upon successful login
      /* redirectToHomepage(); */
    } catch (error) {
      // Handle login error
      setError(error.message);
    }
  };

  return { user, email, setEmail, password, setPassword, error, handleLogin };
};

export default useAuth;
