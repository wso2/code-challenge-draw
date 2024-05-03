import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Home from './Home/Home';
import LoginPage from './LoginPage';
import ProtectedRoute from './ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({ username: '' });

  useEffect(() => {
    let isUserInfoSet = false;
    if (process.env.REACT_APP_ENV === 'development') {
      // Mock the authentication flow
      const mockUserInfo = { username: 'testuser', name: 'Test User' };
      localStorage.setItem('userDetails', JSON.stringify(mockUserInfo));
      isUserInfoSet = true;
    }

    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserDetails(userDetails);
      setLoggedIn(true);
      isUserInfoSet = true;
    }

    if (!isUserInfoSet) {
      const encodedUserInfo = Cookies.get('userinfo');
      if (encodedUserInfo) {
        const userInfo = JSON.parse(atob(encodedUserInfo));
        setUserDetails(userInfo);
        setLoggedIn(true);
        localStorage.setItem('userDetails', JSON.stringify(userInfo));
      }
    }

    setLoading(false); // Set loading to false after authentication check is complete
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }
  
  return (
    // <Home/>
    <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute isLoggedIn={loggedIn} />}>
              <Route path="/" element={
                <Home/>
              } />
            </Route>
          </Routes>
        </Router>
  );
}

export default App;
