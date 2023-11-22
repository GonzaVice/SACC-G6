import React, { useState, useEffect } from 'react';
// import BotonReserva from './component/Buttons/reserva';
// import BotonCarga from './component/Buttons/carga';
// import BotonDescarga from './component/Buttons/descarga';
import LockerTable from './component/Buttons/lockertable';
import axios from 'axios';
import DashboardActualPorEstacion from './component/DashboardActualPorEstacion';

// const getCsrfToken = () => {
//   return document.cookie.split('; ')
//     .find(row => row.startsWith('csrftoken='))
//     .split('=')[1];
// };

function App() {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8000/mqtt/details/', {
  //         headers: {
  //           'X-CSRFToken': getCsrfToken(),
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (response.status === 200) {
  //         // Actualiza el estado con los nuevos datos recibidos
  //         setLockerData(response.data.details);
  //       } else {
  //         throw new Error('Network response was not ok.');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   const intervalId = setInterval(() => {
  //     fetchData();
  //   }, 5000); // Fetch data every 5 seconds

  //   // Limpia el intervalo cuando el componente se desmonta
  //   return () => clearInterval(intervalId);
  // }, []);
  return (
    <div>
      <DashboardActualPorEstacion />
    </div>
  );
}

export default App;
