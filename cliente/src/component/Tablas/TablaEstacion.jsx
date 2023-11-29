import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom';


const TablaEstacion = ({ data }) => { // 
  console.log("DATOS TABLA", data)
  const navigate = useNavigate();
  const handleViewReserva = (reserva) => {
    navigate('/BitacoraReserva', { state: { reserva: reserva } });
  };

  const dimensionesString = (height, width, length) => (
    `${height} x ${width} x ${length}`
  );

  if (!data) {
    return <p>Cargando...</p>;
  }

  if (data.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  console.log("DATA TABLA", data)


  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={tableHeaderStyle}>Casillero</th>
          <th style={tableHeaderStyle}>Dimensiones (cm)</th>
          <th style={tableHeaderStyle}>Estado</th>
          <th style={tableHeaderStyle}>Ocupado</th>
          <th style={tableHeaderStyle}>Abierto</th>
          <th style={tableHeaderStyle}>Fecha Reserva</th>
          <th style={tableHeaderStyle}>Ver Reserva</th>
        </tr>
      </thead>
      <tbody>
      {data.lockers.map((locker) => (
        <tr key={locker.name}>
            <td style={tableCellStyle}>{locker.name}</td>
            <td style={tableCellStyle}>{dimensionesString(locker.height, locker.width, locker.length)}</td>
            <td style={tableCellStyle}>
               
                {locker.reservation ? (
                    <div style={{ color: 'red' }}>No Disponible</div>
                ) : (
                    <div style={{ color: 'green' }}>Disponible</div>
                )}
                
            </td>
            <td style={tableCellStyle}>
                {locker.is_empty ? (
                    <div style={{ color: 'green' }}>Libre</div>
                ) : (
                    <div style={{ color: 'red' }}>Ocupado</div>
                )}
            </td>
            <td style={tableCellStyle}>
                {locker.is_open ? (
                    <div style={{ color: 'green' }}>Abierto</div>
                ) : (
                    <div style={{ color: 'red' }}>Cerrado</div>
                )}
            </td>
            <td style={tableCellStyle}>
                {locker.reservation === null ? (
                    <div>N/A</div>
                ) : (
                    <div>{locker.reservation.datetime}</div>
                )}            
            </td>
            <td style={tableCellStyle}>
            {locker.reservation === null ? (
             'N/A') : (
             <button onClick={() => handleViewReserva(locker.reservation)}>
             Ver Reserva
            </button>)}
            </td>
        </tr>
        ))}

      </tbody>
    </table>
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

export default TablaEstacion;