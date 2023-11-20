import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Login from './component/Registration/Login.jsx';
import Cliente from './component/Cliente/Cliente.jsx'; // Import the Cliente component
import './index.css';

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(''); // Add a state variable for user type

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type); // Set the user type when logging in
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(''); // Clear the user type when logging out
  };

  return (
    <React.StrictMode>
      <Router>
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect from root path to login path */}
          {isLoggedIn ? (
            <>
              {userType === 'cliente' ? (
                <Route path="/cliente" element={<Cliente />} />
              ) : (
                <Route path="/app" element={<App />} />
              )}
            </>
          ) : (
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          )}
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
