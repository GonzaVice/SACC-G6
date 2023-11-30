// Signup.jsx

import React, { useState } from 'react';
import axios from 'axios';

// Function to get the CSRF token
// const getCsrfToken = () => {
//     return document.cookie.split('; ')
//         .find(row => row.startsWith('csrftoken='))
//         .split('=')[1];
// }
const getCsrfToken = async () => {
  const response = await axios.get('http://127.0.0.1:8000/base/set_csrf_token/', {withCredentials: true});
  const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
  return csrfToken;
}
console.log(getCsrfToken());

const Signup = ({ onSignup }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('cliente');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://127.0.0.1:8000/base/register/', {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            user_type: userType,
          }, {
            headers: {
              'X-CSRFToken': getCsrfToken()
            },
            withCredentials: true
          });
          

      if (response.status === 200) {
        onSignup();
      } else {
        console.error('Registration failed:', response.data);
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <h2>Signup</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
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
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <option value="cliente">Cliente</option>
          <option value="operador">Operador</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
