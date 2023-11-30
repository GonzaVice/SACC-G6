// Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';

// // Function to get the CSRF token
// const getCsrfToken = () => {
//     return document.cookie.split('; ')
//         .find(row => row.startsWith('csrftoken='))
//         .split('=')[1];
// }
const getCsrfToken = async () => {
  const response = await axios.get('http://68.183.138.37:8000/base/set_csrf_token/', {withCredentials: true});
  const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
  return csrfToken;
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
      const response = await axios.post('http://68.183.138.37:8000/base/login/', {
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
        
        setUserId(userData.userId);  // Save the user ID
        onLogin('operador', userData.userId);  // Pass the user ID to the onLogin function
        console.log("ESTE ES EL USER ID:", userData.userId );
        navigate('/home')
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
