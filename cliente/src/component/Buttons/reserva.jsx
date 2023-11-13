import React from 'react';
import axios from 'axios';

// Function to get the CSRF token
const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
        
}
console.log('cfsrfsrf KEY');
console.log(getCsrfToken);
console.log(' KEY');

const BotonReserva = () => {
  const manejarClick = async() => {
    const data = {
      'height': 20,
      'width':20,
      'depth':20
    };

    try{
      await axios.post('http://localhost:8000/mqtt/reservation-message/', data, {
        headers: {
          'X-CSRFToken': getCsrfToken()
        }
      });
    } catch(error){
      console.log(error)
    }
  };

  return (
    <button onClick={manejarClick}>
      Reservar
    </button>
  );
};

export default BotonReserva;
