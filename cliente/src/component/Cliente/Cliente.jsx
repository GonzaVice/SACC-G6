import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cliente.css';  // Import the CSS file

const Cliente = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/base/user/${userId}/`, { withCredentials: true });
        if (response.status === 200) {
          console.log(response.data);
          setUserData(response.data.user_data);  // Access the user_data property
          setLoading(false);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading || !userData) {
    return <p>Loading user data...</p>;
  }

  // Parse the 'reservas' field into a JavaScript object
  const reservations = JSON.parse(userData.reservas);

  return (
    <div className="container">
      <h2>User Information</h2>
      <div className="userInfo">
        <p>Name: {userData.name}</p>
        <p>Last Name: {userData.last_name}</p>
        <p>Email: {userData.email}</p>
        <p>User Type: {userData.user_type}</p>
      </div>

      <h2>Reservations</h2>
      {reservations.map((reservation, index) => (
        <div key={index} className="reservation">
          <h3>Reservation {index + 1}</h3>
          <p>Description: {reservation.fields.description}</p>
          <p>Datetime: {new Date(reservation.fields.datetime).toLocaleString()}</p>
          <p>State: {reservation.fields.state}</p>
        </div>
      ))}
    </div>
  );
};
export default Cliente;

