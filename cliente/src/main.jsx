import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import App from './App.jsx';
import Login from './component/Registration/Login.jsx';
import Cliente from './component/Cliente/Cliente.jsx'; // Import the Cliente component
import Operador from './component/Operador/Operador.jsx';
import './index.css';

const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    onLogout();
    navigate('/login');
  };

  return <button onClick={handleClick}>Logout</button>;
};

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(''); // Add a state variable for user type
  const [userId, setUserId] = useState(null);  // Add a state variable for user ID

  const handleLogin = (type, userId) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserId(userId);  // Save the user ID
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(''); // Clear the user type when logging out
  };

  return (
    <React.StrictMode>
      <Router>
        {isLoggedIn && <LogoutButton onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect from root path to login path */}
          {isLoggedIn ? (
            <>
              {userType === 'cliente' ? (
                <Route path="/cliente" element={<Cliente userId={userId} />} />
              ) : (
              userType === 'operador' ? (
                <Route path="/operador" element={<Operador userId={userId} />} />
              ) : (
                <Route path="/app" element={<App />} />
              )
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
