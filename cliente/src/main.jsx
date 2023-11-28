import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import App from './App.jsx';
import Login from './component/Registration/Login.jsx';
import Home from './component/Home/Home.jsx';
import SendKey from './component/SendKey/SendKey.jsx';
import './index.css';
import DashboardActualPorEstacion from './component/DashboardActualPorEstacion.jsx';
import CreateEstacion from './component/EditEstacion/CreateEstacion.jsx';
import AllLockers from './component/EditLocker/AllLockers.jsx';
import CreateLockers from './component/EditLocker/CreateLocker.jsx';
import CreateEcommerce from './component/EditEcommerce/CreateEcommerce.jsx';
import Ecommerce from './component/EditEcommerce/GetAllEcommerce.jsx';
import Reservations from './component/EditEcommerce/GetReservation.jsx';
import EditEcommerce from './component/EditEcommerce/EditEcommerce.jsx';


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
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/home" element={<Navigate to="/login" />} /> {/* Redirect from home to login when not logged in */}
            </>
          )}

          <Route path="/DashboardActualPorEstacion" element={<DashboardActualPorEstacion id={stationName}/>}/>
          <Route path="/CreateEstacion" element={<CreateEstacion />}/>
          <Route path="/all_lockers" element={<AllLockers />}/>
          <Route path="/CreateLocker" element={<CreateLockers />}/>
          <Route path="/CreateEcommerce" element={<CreateEcommerce />}/>
          <Route path="/GetAllEcommerce" element={<Ecommerce />}/>
          <Route path="/GetReservation" element={<Reservations />}/>
          <Route path="/EditEcommerce" element={<EditEcommerce />}/>
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

// Create the root outside of the component
const root = createRoot(document.getElementById('root'));

// Render the component using the root
root.render(<Main />);
