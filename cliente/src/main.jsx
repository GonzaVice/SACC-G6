// main.jsx

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

  return (
    <React.StrictMode>
      {isLoggedIn ? (
        <App />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
