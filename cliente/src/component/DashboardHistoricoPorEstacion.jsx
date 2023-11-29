import React from "react";
import SimpleBarCharts from "./Dashboard/SimpleBarChar";
import SimplePieCharts from "./Dashboard/SimplePieChart";
import TablaEstaciones from "./Tablas/TablasEstaciones";
import TablaEstacion from "./Tablas/TablaEstacion";
import SimpleCard from "./Dashboard/SimpleCard";
import { useState, useEffect } from "react";

  const DashboardHistoricoPorEstacion = ({ data }) => {
    const [stationData, setStationData] = useState('')
    const [stationIdx, setStationIdx] = useState(0);
    const [dataOcupados, setDataOcupados] = useState([]);
    const [estadoOnline, setEstadoOnline] = useState("Offline");

    const mostrarEstadoConexion = (estado) => {
      if (estado) {
        setEstadoOnline("Online");
      } else {
        setEstadoOnline("Offline");
      }
    }

    const mostrarTiempoReservaCarga = (casillero) => { // tiempo reserva-carga de un solo casillero
      let tiempoReservaCarga = 0;
      casillero.reservations.forEach((reserva) => {
        if (reserva.state === "Finalizado") {
          tiempoReservaCarga += reserva.horaCarga - reserva.horaReserva;
        }
      }
      )
      return tiempoReservaCarga;
    }

    const mostrarTiempoCargaDescarga = (casillero) => { // tiempo carga-descarga de un solo casillero
      let tiempoCargaDescarga = 0;
      casillero.reservations.forEach((reserva) => {
        if (reserva.state === "Finalizado") {
          tiempoCargaDescarga += reserva.horaDescarga - reserva.horaCarga;
        }
      }
      )
      return tiempoCargaDescarga;
    }

    const datosReservaCargaDescarga = (data) => { // tiempo carga-descarga de todos los casilleros
      const datachart = [];
      data.forEach((casillero) => {
        datachart.push({name: casillero.name, reservacarga: mostrarTiempoReservaCarga(casillero), cargadescarga: mostrarTiempoCargaDescarga(casillero)});
      }
      )
      return datachart;
    }

    const mostrarReservasPendientes = (data) => {
      let reservasPendientes = 0;
      data.forEach((casillero) => {
        if (casillero.reservado) {
          reservasPendientes++;
        }
      }
      )
      return reservasPendientes;
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
  
          setStationData(response.data.data[0].station);
        } catch (error) {
          console.error('Error al obtener las estaciones:', error);
        }
      };
  
      fetchStations();
      setDataLoaded(true);
    }, []);
  
    // useEffect(() => {
    //   const casillerosOcupados = stationsData[stationIdx].casilleros.filter((casillero) => casillero.ocupado).length;
    //   const casillerosDisponibles = stationsData[stationIdx].casilleros.filter((casillero) => !casillero.ocupado).length;
    //   setDataOcupados([{ name: 'Ocupados', value: casillerosOcupados }, { name: 'Disponibles', value: casillerosDisponibles }]);
    //   mostrarEstadoConexion(stationsData[stationIdx].estadoConexion);
    //   mostrarReservasPendientes(stationsData[stationIdx].casilleros);
    // }, [stationIdx, stationsData]);
  
    const containerStyle = {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap',
    };
  
    return (
      <div>
        <h1 className="text-center text-2xl leading-9 font-bold">Dashboard Historico Por Estación</h1>
        <br />
    
        <div style={containerStyle}>
          <SimpleCard title="Promedio # Casilleros Usados" number="2" margin="10px" />
          <SimpleCard title="Promedio # Casilleros Desocupados" number="1" margin="10px" />
          <SimpleCard
            title="Promedio Tiempo Reserva-Carga"
            number={mostrarReservasPendientes(stationsData[stationIdx].casilleros)}
            margin="10px"
          />
          <SimpleCard
            title="Promedio Tiempo Carga-Retiro"
            number={mostrarReservasPendientes(stationsData[stationIdx].casilleros)}
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
    