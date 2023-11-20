// Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import Signup from './Signup';
import Cliente from '../Cliente/Cliente';
import { useNavigate } from 'react-router-dom';

// Function to get the CSRF token
const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // To toggle between login and signup forms
  const [userType, setUserType] = useState(''); // State to store the user type
  const [userId, setUserId] = useState(null);  // Add a state variable for user ID

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/base/login/', {
        email,
        password,
      }, {
        headers: {
          'X-CSRFToken': getCsrfToken()
        },
        withCredentials: true
      });

      if (response.status === 200) {
        const userData = response.data;
        setUserType(userData.userType);
        setUserId(userData.userId);  // Save the user ID
        if (userData.userType === 'cliente') {
            onLogin('cliente', userData.userId);  // Pass the user ID to the onLogin function
            console.log("ESTE ES EL USER ID:", userData.userId );
            navigate('/cliente', { state: { userId: userData.userId } });
        } else if (userData.userType == 'operador') {
          onLogin('operador', userData.userId);
          console.log("ESTE ES EL OPERADOR ID:", userData.userId );
          navigate('/operador', { state: { userId: userData.userId } });
        }
      } else {
        console.error('Login failed:', response.data);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div>
      {isLogin ? (
        <div>
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account?{' '}
            <span onClick={() => setIsLogin(false)}>Signup here</span>
          </p>
        </div>
      ) : (
        <div>
          <Signup onSignup={onLogin} />
          <p>
            Already have an account?{' '}
            <span onClick={() => setIsLogin(true)}>Login here</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
