import React, { useState, useEffect } from 'react';
// import BotonReserva from './component/Buttons/reserva';
// import BotonCarga from './component/Buttons/carga';
// import BotonDescarga from './component/Buttons/descarga';
import LockerTable from './component/Buttons/lockertable';
import axios from 'axios';
import SimpleBarCharts from './component/Dashboard/SimpleBarChar';
import SimplePieCharts from './component/Dashboard/SimplePieChart';

// const getCsrfToken = () => {
//   return document.cookie.split('; ')
//     .find(row => row.startsWith('csrftoken='))
//     .split('=')[1];
// };

const datapie = [
  {name: "Grupo A", value: 400},
  {name: "Grupo B", value: 300},
  {name: "Grupo C", value: 300},
  {name: "Grupo D", value: 200},
]

const datachart = [
  {name: 'María', age:10, weight:60},
  {name: 'Pedro', age:20, weight:80},
  {name: 'Juan', age:30, weight:100},
  {name: 'Ana', age:40, weight:120},
  {name: 'Luis', age:50, weight:140},
  {name: 'Sara', age:60, weight:160},
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function App() {
  const [lockerData, setLockerData] = useState({
    lockers: [],
    station_id: 1,
  });

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
      <h1 className= "text-center text-2x1 leading-9 font-bold">¡Bienvenido a mi aplicación!</h1>
      <SimpleBarCharts data={datachart}/>
      <SimplePieCharts data={datapie} COLORS={COLORS}/>
      {/* <BotonReserva getCsrfToken={getCsrfToken} />
      <BotonCarga />
      <BotonDescarga /> */}
      {/* Pasa los datos actualizados a la tabla */}
      {/* <LockerTable lockers={lockerData.lockers} stationId={lockerData.station_id} /> */}

    </div>
  );
}

export default App;
