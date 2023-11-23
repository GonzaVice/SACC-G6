import React from "react";
import SimplePieCharts from "./Dashboard/SimplePieChart";
import TablaEstacion from "./Tablas/TablaEstacion";
import SimpleCard from "./Dashboard/SimpleCard";
import { useState, useEffect } from "react";


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
        state: 'disponible', // Disp, Res, Conf, Carg
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
        state: 'disponible', // Disp, Res, Conf, Carg
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
        state: 'disponible', // Disp, Res, Conf, Carg
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
          state: 'disponible', // Disp, Res, Conf, Carg
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
          state: 'disponible', // Disp, Res, Conf, Carg
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
          state: 'disponible', // Disp, Res, Conf, Carg
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
    const [stationsData, setStationsData] = useState(dataTablas);
    const [stationIdx, setStationIdx] = useState(0);
    const [stationName, setStationName] = useState(stationsData[stationIdx].address);
    const [dataOcupados, setDataOcupados] = useState([]);
    const [estadoOnline, setEstadoOnline] = useState("Offline");
    const [tiempoReservaCarga, setTiempoReservaCarga] = useState(0);
    const [tiempoCargaRetiro, setTiempoCargaRetiro] = useState(0);

    const mostrarEstadoConexion = (estado) => {
      if (estado) {
        setEstadoOnline("Online");
      } else {
        setEstadoOnline("Offline");
      }
    }


  
    useEffect(() => {
      const casillerosOcupados = stationsData[stationIdx].lockers.filter((locker) => locker.ocupado).length;
      const casillerosDisponibles = stationsData[stationIdx].lockers.filter((locker) => !locker.ocupado).length;
      setDataOcupados([{ name: 'Ocupados', value: casillerosOcupados }, { name: 'Disponibles', value: casillerosDisponibles }]);
      mostrarEstadoConexion(stationsData[stationIdx].estadoConexion);
    }, [stationIdx, stationsData]);
  
    const containerStyle = {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap',
    };
  
    return (
      <div>
        <h1 className="text-center text-2xl leading-9 font-bold">Dashboard Actual Por Estación</h1>
        <br />
  
        <div style={containerStyle}>
          <SimpleCard title="Casilleros Ocupados" number="2" margin="10px" />
          <SimpleCard title="Casilleros Desocupados" number="1" margin="10px" />
          <SimpleCard title="Estado Conexión" number={estadoOnline} margin="10px" />
        </div>

        <div style={containerStyle}> 
          <SimplePieCharts data={dataOcupados} COLORS = {['#0088FE', '#00C49F']} margin="10px" title="Estado Ocupado Casilleros"/>
          <SimplePieCharts data={dataOcupados} COLORS = {['#0088FE', '#00C49F']} margin="10px" title="Tiempo Reserva-Carga/Carga-Retiro"/>
        </div>
  
        <br />
        <br />
        <br />
        <br />
        <TablaEstacion data={stationsData[stationIdx].casilleros} conexion={stationsData[stationIdx].estadoConexion} />
      </div>
    );
  };
  

export default DashboardActualPorEstacion;