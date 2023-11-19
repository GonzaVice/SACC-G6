import React, { useState, useEffect } from 'react';
// import BotonReserva from './component/Buttons/reserva';
// import BotonCarga from './component/Buttons/carga';
// import BotonDescarga from './component/Buttons/descarga';
import LockerTable from './component/Buttons/lockertable';
import axios from 'axios';

const getCsrfToken = () => {
  return document.cookie.split('; ')
    .find(row => row.startsWith('csrftoken='))
    .split('=')[1];
};

function App() {
  const [lockerData, setLockerData] = useState({
    lockers: [],
    station_id: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/mqtt/details/', {
          headers: {
            'X-CSRFToken': getCsrfToken(),
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          // Actualiza el estado con los nuevos datos recibidos
          setLockerData(response.data.details);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // Fetch data every 5 seconds

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>¡Bienvenido a mi aplicación!</h1>
      {/* <BotonReserva getCsrfToken={getCsrfToken} />
      <BotonCarga />
      <BotonDescarga /> */}
      {/* Pasa los datos actualizados a la tabla */}
      <LockerTable lockers={lockerData.lockers} stationId={lockerData.station_id} />
    </div>
  );
}

export default App;
