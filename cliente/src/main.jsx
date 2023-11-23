import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import App from './App.jsx';
import Login from './component/Registration/Login.jsx';
import Home from './component/Home/Home.jsx';
import SendKey from './component/SendKey/SendKey.jsx';
import './index.css';
import DashboardActualPorEstacion from './component/DashboardActualPorEstacion.jsx';

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
  const [stationName, setStationName] = useState(''); // Add a state variable for station name
  
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
          <Route path="/sendkey" element={<SendKey />} />
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect from root path to login path */}
          {isLoggedIn ? (
            <Route path="/home" element={<Home />}/>
          ) : (
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          )}

          <Route path="/DashboardActualPorEstacion" element={<DashboardActualPorEstacion id={stationName}/>}/>

        </Routes>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
