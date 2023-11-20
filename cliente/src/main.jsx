import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import Login from './component/Registration/Login.jsx';
import './index.css';

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <React.StrictMode>
      {isLoggedIn ? (
        <>
          <App />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
