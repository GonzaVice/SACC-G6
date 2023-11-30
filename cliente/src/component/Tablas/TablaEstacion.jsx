import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom';


const TablaEstacion = ({ data }) => { // 
  console.log("DATOS TABLA", data)
  const navigate = useNavigate();
  const handleViewReserva = (reserva) => {
    navigate('/BitacoraReserva', { state: { reserva: reserva } });
  };
  const plazoReserva = (reserva) => {
    const fechaReserva = new Date(reserva.datetime);
    const fechaActual = new Date();
    const diffTime = Math.abs(fechaActual - fechaReserva);
    const diffMins = Math.ceil(diffTime / (1000 * 60));
    if (diffMins > 10) {
      return 'Reserva Vencida';
    } else {
      return `Le quedan ${10 - diffMins} minutos`;
    }
  };

  const plazoCarga = (reserva) => {
    const fechaCarga = new Date(reserva.horaCarga);
    const fechaActual = new Date();
    const diffTime = Math.abs(fechaActual - fechaCarga);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 10) {
      return 'Paquete Olvidado';
    } else {
      return `Le quedan ${10 - diffDays} días`;
    }
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

  const inconsistencias = (locker) => {
    if (locker-reservation && (locker.reservation=="Reservado" || locker.reservation=="Confirmado_Reserva" || locker.reservation=="Confirmado_Op")) {
      if (locker.is_empty) {
        return 'El casillero está vacío pero tiene una reserva';
      }
      if (locker.is_open) {
        return 'El casillero está abierto pero tiene una reserva';
      }
    } else {
      if (!locker.is_empty) {
        return 'El casillero está ocupado pero no tiene una reserva';
      }
      if (!locker.is_open) {
        return 'El casillero está cerrado pero no tiene una reserva';
      }
    }
    return 'Sin inconsistencias';
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
          <th style={tableHeaderStyle}>Plazo Reserva</th>
          <th style={tableHeaderStyle}>Paquete Olvidado</th>
          <th style={tableHeaderStyle}>Inconsistencias</th>
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
                    <div>N/A</div>
                ) : (
                    <div>{plazoReserva(locker.reservation)}</div>
                )}
            </td>
            <td style={tableCellStyle}>
                {locker.reservation === null ? (
                    <div>N/A</div>
                ) : (
                    <div>{plazoCarga(locker.reservation)}</div>
                )}
            </td>
            <td style={tableCellStyle}>
                {inconsistencias(locker)}
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