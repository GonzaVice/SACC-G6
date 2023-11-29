import React from "react";
import SimplePieCharts from "./Dashboard/SimplePieChart";
import TablaEstacion from "./Tablas/TablaEstacion.jsx";
import SimpleCard from "./Dashboard/SimpleCard";
import { useState, useEffect } from "react";
import DashboardHistoricoPorEstacion from "./DashboardHistoricoPorEstacion";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { set } from "lodash";

const DashboardActualPorEstacion = () => {
  const [stationData, setStationData] = useState('')
  const [dataOcupados, setDataOcupados] = useState([]);
  const [cantidadCasillerosOcupados, setCantidadCasillerosOcupados] = useState("0")
  const[cantidadCasillerosDesocupados, setCantidadCasillerosDesocupados] = useState("0")
  const [estadoOnline, setEstadoOnline] = useState("Offline");
  const location = useLocation();
  const { station_name, station_id } = location.state;
  const [isLoaded, setDataLoaded] = useState(false)
  const navigate = useNavigate();

  const getCsrfToken = () => {
    return document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))
      .split('=')[1];
  };


  const tiempoReservaCarga = (locker) => {
    var tiempoReservaCarga = 0
    if (locker.reservation) {
      if (locker.reservation.horaCarga) {
        tiempoReservaCarga = locker.reservation.horaCarga - locker.reservation.horaReserva
      }
    }
    return tiempoReservaCarga
  }

  const tiempoCargaDescarga = (locker) => {
    var tiempoCargaDescarga = 0
    if (locker.reservation) {
      if (locker.reservation.horaDescarga) {
        tiempoCargaDescarga = locker.reservation.horaDescarga - locker.reservation.horaCarga
      }
    }
    return tiempoCargaDescarga
  }

  const mostrarEstadoConexion = (estado) => {
    if (estado) {
      setEstadoOnline("Online");
    } else {
      setEstadoOnline("Offline");
    }
  }

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const csrfToken = getCsrfToken();
        const headers = {
          'X-CSRFToken': csrfToken,
        };

        const response = await axios.get('http://127.0.0.1:8000/base/dashboard/', {
          headers,
          withCredentials: true,
        });

        console.log("ESTO ES EL DATADATA",response.data.data);

        for (var i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].station['name'] == StationName) {
            console.log("ENCONTRADO");
            setStationData(response.data.data[i].station);

          }
          else {
            console.log("NO ENCONTRADO");
            setStationData(null);
          }
        }
        if (stationData == null) {
          mostrarEstadoConexion(false);
        }
        else {
          mostrarEstadoConexion(true);
        }
        console.log('STATIONDATA', stationData)
      } catch (error) {
        console.error('Error al obtener las estaciones:', error);
      }
    };

    fetchStations();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (stationData && stationData.lockers) {
      var casillerosDisponibles = stationData.lockers.filter((locker) => locker.state === 0).length;
      var dispCounter = 0
      for (var i = 0; i < stationData.lockers.length; i++) {
        if (stationData.lockers[i].reservation) {
          dispCounter++
          console.log("RESERVADO");
        }
      }
      var casillerosOcupados = dispCounter
      
      setDataOcupados([{ name: 'Ocupados', value: casillerosOcupados }, { name: 'Disponibles', value: casillerosDisponibles }]);
      // mostrarEstadoConexion(stationData.connection);
      setCantidadCasillerosOcupados(casillerosOcupados);
      setCantidadCasillerosDesocupados(casillerosDisponibles);
    }
  }, [stationData]);

  const handleEditClick = () => {
    console.log(station_id)
    navigate(`/edit/${station_id}`);
  };

  const handleVerDatosHistoricos = () => {
    console.log("Redirigiendo a datos históricos...");
    // window.location.href = '/ruta-de-datos-historicos'; // Ejemplo de redirección
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  };
  console.log(stationData)

  const handleDeleteLocker =  async () => {
    try {
        const csrfToken = getCsrfToken();
        const headers = {
            'X-CSRFToken': csrfToken,
        };

        // Realiza la solicitud POST para eliminar el casillero
        await axios.post(`http://127.0.0.1:8000/base/delete_station/`, 
        { 
            'station_id':station_id
        }, {
            headers,
            withCredentials: true,
        });

        // Recarga la página después de eliminar el casillero
        navigate('/home')
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl leading-9 font-bold">Dashboard Actual Por Estación</h1>
      <div className="button-container">
        <button
          className="btn btn-danger"
          onClick={() => handleDeleteLocker()}
        >
          Eliminar
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleEditClick()}
        >
          Editar
        </button>
      </div>
      <br />
      <button onClick={handleVerDatosHistoricos}>Ver Datos Históricos</button>
      
      <h2 className="text-center text-2xl leading-9 font-bold">Estación: {station_name}</h2>

      <div style={containerStyle}>
        <SimpleCard title="Casilleros Reservados" number={cantidadCasillerosOcupados} margin="10px" />
        <SimpleCard title="Estado Conexión" number={estadoOnline} margin="10px" />
        <SimpleCard title="Porcentaje Uso" number={cantidadCasillerosOcupados/3} margin="10px" />
      </div>

      <div style={containerStyle}> 
        <SimplePieCharts data={dataOcupados} COLORS = {['#0088FE', '#00C49F']} margin="10px" title="Estado Ocupado Casilleros"/>
        {/* <SimplePieCharts data={dataOcupados} COLORS = {['#0088FE', '#00C49F']} margin="10px" title="Tiempo Reserva-Carga/Carga-Retiro Casillero 1"/>
        <SimplePieCharts data={dataOcupados} COLORS = {['#0088FE', '#00C49F']} margin="10px" title="Tiempo Reserva-Carga/Carga-Retiro Casillero 2"/>
        <SimplePieCharts data={dataOcupados} COLORS = {['#0088FE', '#00C49F']} margin="10px" title="Tiempo Reserva-Carga/Carga-Retiro Casillero 3"/> */}

      
      </div>
        
      <br />
      <br />
      <br />
      <TablaEstacion data={stationData} />

      <div style={containerStyle}>
        <h2 className="text-center text-2xl leading-9 font-bold">Casillero 1</h2>
      </div>
      {/* <SimpleCard title="Tiempo Reserva-Carga" number={tiempoReservaCarga(stationData.lockers[0])} margin="10px" /> */}

      <div style={containerStyle}>
        <h2 className="text-center text-2xl leading-9 font-bold">Casillero 2</h2>
      </div>
      {/* <SimpleCard title="Tiempo Reserva-Carga" number={tiempoReservaCarga(stationData.lockers[0])} margin="10px" /> */}

      <div style={containerStyle}>
        <h2 className="text-center text-2xl leading-9 font-bold">Casillero 3</h2>
      </div>
      {/* <SimpleCard title="Tiempo Reserva-Carga" number={tiempoReservaCarga(stationData.lockers[0])} margin="10px" /> */}

    </div>
    
  );
};

const tableHeaderStyle = {
  textAlign: 'center',
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
  textAlign: 'center',
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

export default DashboardActualPorEstacion;