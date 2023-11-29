import React from "react";
import SimplePieCharts from "./Dashboard/SimplePieChart";
import SimpleCard from "./Dashboard/SimpleCard";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

const DashboardHistoricoPorEstacion = () => {
  const [stationData, setStationData] = useState('')
  const [dataOcupados, setDataOcupados] = useState([]);
  const location = useLocation();
  const { station_name, station_id } = location.state;
  const navigate = useNavigate();
  const [diasAtras, setDiasAtras] = useState(7);

    function calcularHoras(fecha1, fecha2) {
      fecha1 = new Date(fecha1);
      fecha2 = new Date(fecha2);
      var diferencia = Math.abs(fecha2 - fecha1);
      var horas = diferencia / (1000 * 60 * 60);
      return horas.toFixed(2);
    }

    function calcularDiasHoras(fecha1, fecha2) {
      fecha1 = new Date(fecha1);
      fecha2 = new Date(fecha2);
      var diferencia = Math.abs(fecha2 - fecha1);
      var totalHoras = diferencia / (1000 * 60 * 60);
      var dias = Math.floor(totalHoras / 24);
      var horas = totalHoras % 24;
      return dias + " días y " + horas.toFixed(1) + " horas";
  }
  const getCsrfToken = () => {
    return document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))
      .split('=')[1];
  };


    const tiempoReservaCarga = (locker) => {
      //toma el tiempo de reserva y carga con el formato "2023-11-02 01:53:17" y calcula el itempo de reserva-carga
      var tiempoReservaCarga = 0
      console.log("LOCKER", locker)
      if (locker.reservation) {
        if (locker.reservation.horaCarga) {
          tiempoReservaCarga = calcularDiasHoras(locker.reservation.datetime, locker.reservation.horaCarga)
        }
      }
      return tiempoReservaCarga
    }

    const tiempoCargaDescarga = (locker) => {
      var tiempoReservaCarga = 0
      console.log("LOCKER", locker)
      if (locker.reservation) {
        if (locker.reservation.horaCarga && locker.reservation.horaDescarga) {
          tiempoReservaCarga = calcularDiasHoras(locker.reservation.horaDescarga, locker.reservation.horaCarga)
        }
      }
      return tiempoReservaCarga
    }
    
    const fetchStations = async () => {
      try {
        const csrfToken = getCsrfToken();
        const headers = {
          'X-CSRFToken': csrfToken,
        };

        const response = await axios.post('http://127.0.0.1:8000/base/reservas_historicas_estacion/', {station_name} ,{
          headers,
          withCredentials: true,
        });

        console.log("ESTO ES EL DATADATA",response.data);
        setStationData(response.data);
        console.log('STATIONDATA', stationData)
      } catch (error) {
        console.error('Error al obtener las estaciones:', error);
      }
    };
  
    useEffect(() => {
      // Obtener datos inicialmente
      fetchStations();
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
      }
    }, [stationData]);

    const containerStyle = {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap',
    };

    let haceUnaSemana = new Date();
  haceUnaSemana.setDate(haceUnaSemana.getDate() - diasAtras);

  let reservasFiltradasOcupado = {};

  for (let id in stationData) {
      let reserva = stationData[id];
      let horaFinalizado = new Date(reserva.horaFinalizacion);

      if (horaFinalizado >= haceUnaSemana || (reserva.horaCencelado >= haceUnaSemana)) {
          reservasFiltradasOcupado[id] = reserva;
      }
  }

  const cantidadReservasFiltradasOcupado = Object.keys(reservasFiltradasOcupado).length;


    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAA', reservasFiltradasOcupado);

    return (
      <div>
        <h1 className="text-center text-2xl leading-9 font-bold">Dashboard Historico Por Estación</h1>
        <br />
    
        <div style={containerStyle}>
          <SimpleCard title="Promedio % Uso" number={cantidadReservasFiltradasOcupado} margin="10px" />
          <SimpleCard title="Promedio # Casilleros Desocupados" number="1" margin="10px" />
          <SimpleCard
            title="Promedio Tiempo Reserva-Carga"
            number={4}
            margin="10px"
          />
          <SimpleCard
            title="Promedio Tiempo Carga-Retiro"
            number={5}
            margin="10px"
          />
        </div>
    
        <div style={containerStyle}>
          <SimplePieCharts data={dataOcupados} COLORS={['#0088FE', '#00C49F']} margin="10px" title="Promedio Porcentaje Uso" />
        </div>
    
        <br />
        <br />
        <br />
        <br />

        <div style={containerStyle}>
          <h2 className="text-center text-2xl leading-9 font-bold">Casillero 1</h2>
        </div>
        <SimpleCard title="Promedio Tiempo Reserva-Carga" number={stationData && stationData.lockers && stationData.lockers.length > 0 ? tiempoReservaCarga(stationData.lockers[0]) : 'N/A'} margin="10px" />
        <SimpleCard title="Promedio Tiempo Carga-Descarga" number={stationData && stationData.lockers && stationData.lockers.length > 0 ? tiempoCargaDescarga(stationData.lockers[0]) : 'N/A'} margin="10px" />
      
        <div style={containerStyle}>
          <h2 className="text-center text-2xl leading-9 font-bold">Casillero 2</h2>
        </div>
        <SimpleCard title="Promedio Tiempo Reserva-Carga" number={stationData && stationData.lockers && stationData.lockers.length > 0 ? tiempoReservaCarga(stationData.lockers[1]) : 'N/A'} margin="10px" />
        <SimpleCard title="Promedio Tiempo Carga-Descarga" number={stationData && stationData.lockers && stationData.lockers.length > 0 ? tiempoCargaDescarga(stationData.lockers[1]) : 'N/A'} margin="10px" />
      
        <div style={containerStyle}>
          <h2 className="text-center text-2xl leading-9 font-bold">Casillero 3</h2>
        </div>
        <SimpleCard title="Promedio Tiempo Reserva-Carga" number={stationData && stationData.lockers && stationData.lockers.length > 0 ? tiempoReservaCarga(stationData.lockers[2]) : 'N/A'} margin="10px" />
        <SimpleCard title="Promedio Tiempo Carga-Descarga" number={stationData && stationData.lockers && stationData.lockers.length > 0 ? tiempoCargaDescarga(stationData.lockers[2]) : 'N/A'} margin="10px" />
      </div>

      

    );
    };
    
    export default DashboardHistoricoPorEstacion;
    