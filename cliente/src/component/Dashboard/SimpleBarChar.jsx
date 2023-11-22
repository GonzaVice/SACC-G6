import React from "react";
// import { useState } from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from "recharts";

// const [data, setData] = useState([
//     {
//       id: 1,
//       address: 'Dirección 1',
//       cantidadCasilleros: 3,
//       cantidadCasillerosDisponibles: 2,
//       estadoConexion: true,
//       casilleros: [ {
//         id: 1,
//         dimensiones: '10x20x60',
//         reservado: false,
//         idReservaActual: 1,
//         ocupado: false,
//         porcentajeUso: 0,
//         historial: [
//           {
//             idReserva: 1,
//             horaReserva: '10:30',
//             horaCargado: '10:40',
//             horaDescargado: '18:51'
//           },
//           {
//             idReserva: 2,
//             horaReserva: '12:30',
//             horaCargado: '18:40',
//             horaDescargado: '20:51'
//           },
//         ],
//       },
//       {
//         id: 2,
//         dimensiones: '10x40x50',
//         reservado: true,
//         idReservaActual: 1,
//         ocupado: true,
//         porcentajeUso: 0,
//         historial: [
//           {
//             idReserva: 1,
//             horaReserva: '10:30',
//             horaCargado: '10:40',
//             horaDescargado: '18:51'
//           },
//           {
//             idReserva: 2,
//             horaReserva: '12:30',
//             horaCargado: '12:40',
//             horaDescargado: '20:51'
//           },
//         ],
//       },
//       {
//         id: 3,
//         dimensiones: '10x30x80',
//         reservado: false,
//         ocupado: false,
//         porcentajeUso: 0,
//         historial: [
//           {
//             idReserva: 1,
//             horaReserva: '10:30',
//             horaCargado: '10:40',
//             horaDescargado: '18:51'
//           },
//           {
//             idReserva: 2,
//             horaReserva: '12:30',
//             horaCargado: '12:40',
//             horaDescargado: '20:51'
//           },
//         ],
//       },
//       ]
//     },
//     {
//       id: 2,
//       address: 'Dirección 2',
//       cantidadCasilleros: 3,
//       cantidadCasillerosDisponibles: 1,
//       estadoConexion: true,
//       casilleros: [
//         {
//           id: 1,
//           dimensiones: '10x40x40',
//           reservado: false,
//           idReservaActual: 1,
//           ocupado: false,
//           porcentajeUso: 0,
//           historial: [
//             {
//               idReserva: 1,
//               horaReserva: '10:30',
//               horaCargado: '10:40',
//               horaDescargado: '18:51'
//             },
//             {
//               idReserva: 2,
//               horaReserva: '12:30',
//               horaCargado: '12:40',
//               horaDescargado: '20:51'
//             },
//           ],
//         },
//         {
//           id: 2,
//           dimensiones: '10x30x30',
//           reservado: false,
//           idReservaActual: 1,
//           ocupado: false,
//           porcentajeUso: 0,
//           historial: [
//             {
//               idReserva: 1,
//               horaReserva: '10:30',
//               horaCargado: '10:40',
//               horaDescargado: '18:51'
//             },
//             {
//               idReserva: 2,
//               horaReserva: '12:30',
//               horaCargado: '12:40',
//               horaDescargado: '20:51'
//             },
//           ],
//         },
//         {
//           id: 3,
//           dimensiones: '10x50x50',
//           reservado: false,
//           idReservaActual: 1,
//           ocupado: false,
//           porcentajeUso: 0,
//           historial: [
//             {
//               idReserva: 1,
//               horaReserva: '10:30',
//               horaCargado: '10:40',
//               horaDescargado: '18:51'
//             },
//             {
//               idReserva: 2,
//               horaReserva: '12:30',
//               horaCargado: '12:40',
//               horaDescargado: '20:51'
//             },
//           ],
//         },
//       ]
//     },
//   ]);

const SimpleBarCharts = ({data}) => {
    return (
        <ResponsiveContainer width="100%" aspect={2}>
            <BarChart width={600} height={300} data={data} margin={{top:5, right:30, left:20, bottom:5}}>
                <CartesianGrid strokeDasharray="4 1" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="age" fill="#8884d8" />
                <Bar dataKey="weight" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SimpleBarCharts;