import React from "react";
import SimplePieCharts from "./Dashboard/SimplePieChart";
import TablaEstacion from "./Tablas/TablaEstacion.jsx";
import SimpleCard from "./Dashboard/SimpleCard";
import { useState, useEffect } from "react";
import DashboardHistoricoPorEstacion from "./DashboardHistoricoPorEstacion";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { set } from "lodash";

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
  
  const dataTablas = [
    {
      name: "Estación 1",
      connection: true,
      lockers: [ {
        id: 1,
        length: '10',
        width: '20',
        height: '60',
        state: 'Disponible', // Disp, Res, Conf, Carg
        reservations: [
          {
            name: "Reserva 1",
            horaReserva: '10:30',
            operador: 'Juan',
            operadorPassword: '1234',
            cliente: 'Maria',
            clientePassword: '1234',
            horaConfirmacionReserva: '10:35',
            horaConfirmacionOperario: '10:36',
            horaCarga: '10:40',
            horaDescarga: '18:51',
            horaFinalizacion: '18:51',
            horaCancelacion: '',
            state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
            ecommerce: "Mercado Libre",
          },
          {
            name: "Reserva 2",
            horaReserva: '12:30',
            operador: 'AAA',
            operadorPassword: '1234',
            cliente: 'Si',
            clientePassword: '1234',
            horaConfirmacionReserva: '12:35',
            horaConfirmacionOperario: '12:36',
            horaCarga: '12:40',
            horaDescarga: '19:51',
            horaFinalizacion: '19:51',
            horaCancelacion: '',
            state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
            ecommerce: "Mercado Libre",
          },
        ],
      },
      {
        id: 2,
        length: '30',
        width: '20',
        height: '30',
        state: 'Confirmado', // Disp, Res, Conf, Carg
        reservations: [
          {
            name: "Reserva 3",
            horaReserva: '10:39',
            operador: 'QQQQ',
            operadorPassword: '1234',
            cliente: 'PPP',
            clientePassword: '1234',
            horaConfirmacionReserva: '10:39',
            horaConfirmacionOperario: '10:39',
            horaCarga: '10:40',
            horaDescarga: '18:51',
            horaFinalizacion: '18:51',
            horaCancelacion: '',
            state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
            ecommerce: "Mercado Libre",
          },
          {
            name: "Reserva 4",
            horaReserva: '10:30',
            operador: 'Juan',
            operadorPassword: '1234',
            cliente: 'Maria',
            clientePassword: '1234',
            horaConfirmacionReserva: '10:35',
            horaConfirmacionOperario: '10:36',
            horaCarga: '10:40',
            horaDescarga: '18:51',
            horaFinalizacion: '18:51',
            horaCancelacion: '',
            state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
            ecommerce: "Mercado Libre",
          },
        ],
      },
      {
        id: 3,
        length: '50',
        width: '20',
        height: '90',
        state: 'Cargado', // Disp, Res, Conf, Carg
        reservations: [
          {
            name: "Reserva 5",
            horaReserva: '10:30',
            operador: 'Juan',
            operadorPassword: '1234',
            cliente: 'Maria',
            clientePassword: '1234',
            horaConfirmacionReserva: '10:35',
            horaConfirmacionOperario: '10:36',
            horaCarga: '10:40',
            horaDescarga: '18:51',
            horaFinalizacion: '18:51',
            horaCancelacion: '',
            state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
            ecommerce: "Mercado Libre",
          },
          {
            name: "Reserva 6",
            horaReserva: '10:30',
            operador: 'Juan',
            operadorPassword: '1234',
            cliente: 'Maria',
            clientePassword: '1234',
            horaConfirmacionReserva: '10:35',
            horaConfirmacionOperario: '10:36',
            horaCarga: '10:40',
            horaDescarga: '18:51',
            horaFinalizacion: '18:51',
            horaCancelacion: '',
            state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
            ecommerce: "Mercado Libre",
          },
        ],
      },
      ]
    },
    {
      name: "Estación 2",
      estadoConexion: true,
      lockers: [
        {
          id: 1,
          length: '10',
          width: '20',
          height: '60',
          state: 'Disponible', // Disp, Res, Conf, Carg
          reservations: [
            {
              name: "Reserva 7",
              horaReserva: '10:30',
              operador: 'Juan',
              operadorPassword: '1234',
              cliente: 'Maria',
              clientePassword: '1234',
              horaConfirmacionReserva: '10:35',
              horaConfirmacionOperario: '10:36',
              horaCarga: '10:40',
              horaDescarga: '18:51',
              horaFinalizacion: '18:51',
              horaCancelacion: '',
              state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
              ecommerce: "Mercado Libre",
            },
            {
              name: "Reserva 8",
              horaReserva: '10:30',
              operador: 'Juan',
              operadorPassword: '1234',
              cliente: 'Maria',
              clientePassword: '1234',
              horaConfirmacionReserva: '10:35',
              horaConfirmacionOperario: '10:36',
              horaCarga: '10:40',
              horaDescarga: '18:51',
              horaFinalizacion: '18:51',
              horaCancelacion: '',
              state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
              ecommerce: "Mercado Libre",
            },
          ],
        },
        {
          id: 1,
          length: '10',
          width: '20',
          height: '60',
          state: 'Disponible', // Disp, Res, Conf, Carg
          reservations: [
            {
              name: "Reserva 9",
              horaReserva: '10:30',
              operador: 'Juan',
              operadorPassword: '1234',
              cliente: 'Maria',
              clientePassword: '1234',
              horaConfirmacionReserva: '10:35',
              horaConfirmacionOperario: '10:36',
              horaCarga: '10:40',
              horaDescarga: '18:51',
              horaFinalizacion: '18:51',
              horaCancelacion: '',
              state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
              ecommerce: "Mercado Libre",
            },
            {
              name: "Reserva 10",
              horaReserva: '10:30',
              operador: 'Juan',
              operadorPassword: '1234',
              cliente: 'Maria',
              clientePassword: '1234',
              horaConfirmacionReserva: '10:35',
              horaConfirmacionOperario: '10:36',
              horaCarga: '10:40',
              horaDescarga: '18:51',
              horaFinalizacion: '18:51',
              horaCancelacion: '',
              state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
              ecommerce: "Mercado Libre",
            },
          ],
        },
        {
          id: 1,
          length: '10',
          width: '20',
          height: '60',
          state: 'Disponible', // Disp, Res, Conf, Carg
          reservations: [
            {
              name: "Reserva 11",
              horaReserva: '10:30',
              operador: 'Juan',
              operadorPassword: '1234',
              cliente: 'Maria',
              clientePassword: '1234',
              horaConfirmacionReserva: '10:35',
              horaConfirmacionOperario: '10:36',
              horaCarga: '10:40',
              horaDescarga: '18:51',
              horaFinalizacion: '18:51',
              horaCancelacion: '',
              state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
              ecommerce: "Mercado Libre",
            },
            {
              name: "Reserva 12",
              horaReserva: '10:30',
              operador: 'Juan',
              operadorPassword: '1234',
              cliente: 'Maria',
              clientePassword: '1234',
              horaConfirmacionReserva: '10:35',
              horaConfirmacionOperario: '10:36',
              horaCarga: '10:40',
              horaDescarga: '18:51',
              horaFinalizacion: '18:51',
              horaCancelacion: '',
              state: "Reservado", // Res, Conf_Res, Conf_Op, Cancel, Finaliz
              ecommerce: "Mercado Libre",
            },
          ],
        },
      ]
    },
  ];

  const DashboardActualPorEstacion = () => {
    const [stationData, setStationData] = useState('')
    const [dataOcupados, setDataOcupados] = useState([]);
    const [cantidadCasillerosOcupados, setCantidadCasillerosOcupados] = useState("0")
    const[cantidadCasillerosDesocupados, setCantidadCasillerosDesocupados] = useState("0")
    const [estadoOnline, setEstadoOnline] = useState("Offline");
    const location = useLocation();
    const { station_name, connection } = location.state;
    const [isLoaded, setDataLoaded] = useState(false)

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
            if (response.data.data[i].station['name'] == station_name) {
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
    return (
      <div>
        <h1 className="text-center text-2xl leading-9 font-bold">Dashboard Actual Por Estación</h1>
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