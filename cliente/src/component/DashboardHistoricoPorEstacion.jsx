import React from "react";
import SimpleBarCharts from "./Dashboard/SimpleBarChar";
import SimplePieCharts from "./Dashboard/SimplePieChart";
import TablaEstaciones from "./Tablas/TablasEstaciones";
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
        id: 1,
        address: 'Dirección 1',
        cantidadCasilleros: 3,
        cantidadCasillerosDisponibles: 2,
        estadoConexion: true,
        casilleros: [ {
          id: 1,
          dimensiones: '10x20x60',
          reservado: false,
          idReservaActual: 1,
          ocupado: false,
          porcentajeUso: 0,
          historial: [
            {
              idReserva: 1,
              horaReserva: '10:30',
              horaCargado: '10:40',
              horaDescargado: '18:51'
            },
            {
              idReserva: 2,
              horaReserva: '12:30',
              horaCargado: '18:40',
              horaDescargado: '20:51'
            },
          ],
        },
        {
          id: 2,
          dimensiones: '10x40x50',
          reservado: true,
          idReservaActual: 1,
          ocupado: true,
          porcentajeUso: 0,
          historial: [
            {
              idReserva: 1,
              horaReserva: '10:30',
              horaCargado: '10:40',
              horaDescargado: '18:51'
            },
            {
              idReserva: 2,
              horaReserva: '12:30',
              horaCargado: '12:40',
              horaDescargado: '20:51'
            },
          ],
        },
        {
          id: 3,
          dimensiones: '10x30x80',
          reservado: false,
          ocupado: false,
          porcentajeUso: 0,
          historial: [
            {
              idReserva: 1,
              horaReserva: '10:30',
              horaCargado: '10:40',
              horaDescargado: '18:51'
            },
            {
              idReserva: 2,
              horaReserva: '12:30',
              horaCargado: '12:40',
              horaDescargado: '20:51'
            },
          ],
        },
        ]
      },
      {
        id: 2,
        address: 'Dirección 2',
        cantidadCasilleros: 3,
        cantidadCasillerosDisponibles: 1,
        estadoConexion: true,
        casilleros: [
          {
            id: 1,
            dimensiones: '10x40x40',
            reservado: false,
            idReservaActual: 1,
            ocupado: false,
            porcentajeUso: 0,
            historial: [
              {
                idReserva: 1,
                horaReserva: '10:30',
                horaCargado: '10:40',
                horaDescargado: '18:51'
              },
              {
                idReserva: 2,
                horaReserva: '12:30',
                horaCargado: '12:40',
                horaDescargado: '20:51'
              },
            ],
          },
          {
            id: 2,
            dimensiones: '10x30x30',
            reservado: false,
            idReservaActual: 1,
            ocupado: false,
            porcentajeUso: 0,
            historial: [
              {
                idReserva: 1,
                horaReserva: '10:30',
                horaCargado: '10:40',
                horaDescargado: '18:51'
              },
              {
                idReserva: 2,
                horaReserva: '12:30',
                horaCargado: '12:40',
                horaDescargado: '20:51'
              },
            ],
          },
          {
            id: 3,
            dimensiones: '10x50x50',
            reservado: false,
            idReservaActual: 1,
            ocupado: false,
            porcentajeUso: 0,
            historial: [
              {
                idReserva: 1,
                horaReserva: '10:30',
                horaCargado: '10:40',
                horaDescargado: '18:51'
              },
              {
                idReserva: 2,
                horaReserva: '12:30',
                horaCargado: '12:40',
                horaDescargado: '20:51'
              },
            ],
          },
        ]
      },
  ];

  const DashboardHistoricoPorEstacion = () => {
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

    const mostrarPieEstadoReservaCarga = (data) => {
      let tiempoReservaCarga = 0;
      data.forEach((casillero) => {
        if (casillero.reservado) {
          let horaReserva = casillero.historial[casillero.historual.length-1].horaReserva;
          let horaCargado = casillero.historial[casillero.historual.length-1].horaCargado;
          let horaRetirado = casillero.historial[casillero.historual.length-1].horaDescargado;
          tiempoReservaCarga = horaCargado - horaReserva;
        }
      }
      )
      return tiempoReservaCarga;
    }
  
    useEffect(() => {
      const casillerosOcupados = stationsData[stationIdx].casilleros.filter((casillero) => casillero.ocupado).length;
      const casillerosDisponibles = stationsData[stationIdx].casilleros.filter((casillero) => !casillero.ocupado).length;
      setDataOcupados([{ status: 'Ocupados', value: casillerosOcupados }, { status: 'Disponibles', value: casillerosDisponibles }]);
      mostrarEstadoConexion(stationsData[stationIdx].estadoConexion);
      mostrarReservasPendientes(stationsData[stationIdx].casilleros);
    }, [stationIdx, stationsData]);
  
    const containerStyle = {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap',
    };
  
    return (
      <div>
        <h2 className="text-center text-2xl leading-9 font-bold">Dashboard Historico Por Estación</h2>
        <br />
  
        <div style={containerStyle}>
          <SimpleCard title="Promedio # Casilleros Usados" number="2" margin="10px" />
          <SimpleCard title="Promedio # Casilleros Desocupados" number="1" margin="10px" />
          <SimpleCard title="Promedio Tiempo Reserva-Carga" number={mostrarReservasPendientes(stationsData[stationIdx].casilleros)} margin="10px" />
          <SimpleCard title="Promedio Tiempo Carga-Retiro" number={mostrarReservasPendientes(stationsData[stationIdx].casilleros)} margin="10px" />
        </div>

        <div style={containerStyle}> 
          <SimplePieCharts data={dataOcupados} COLORS = {['#0088FE', '#00C49F']} margin="10px" title="Promedio Porcentaje Uso"/>
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
  

export default DashboardHistoricoPorEstacion;