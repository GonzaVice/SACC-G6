import {React, useState} from 'react';

const TablaEstacion = ({ data }) => { // 
  console.log("DATOS TABLA", data)
  const handleViewReserva = (station) => {
    console.log(`Redirigiendo a Reserva ${station.id}`);
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
          <th style={tableHeaderStyle}>Hora Reserva</th>
          <th style={tableHeaderStyle}>Hora Ocupado</th>
          <th style={tableHeaderStyle}>Porcentaje de Uso</th>
          <th style={tableHeaderStyle}>Ver Reserva</th>
        </tr>
      </thead>
      <tbody>
      {data.lockers.map((locker) => (
        <tr key={locker.name}>
            <td style={tableCellStyle}>{locker.name}</td>
            <td style={tableCellStyle}>{dimensionesString(locker.height, locker.width, locker.length)}</td>
            <td style={tableCellStyle}>{locker.state}</td>
            <td style={tableCellStyle}>locker.ocupado</td>
            <td style={tableCellStyle}>locker.abierto</td>
            <td style={tableCellStyle}>
                {locker.reservado ? (
                    <div key={locker.reservations[locker.reservations.length - 1].horaReserva}>
                    {locker.reservations[locker.reservations.length - 1].horaReserva}
                    </div>
                ) : (
                    'N/A'
                )}
            </td>
            <td style={tableCellStyle}>
                {locker.reservado ? (
                    <div key={locker.reservations[locker.reservations.length - 1].horaCargado}>
                    {locker.reservations[locker.reservations.length - 1].horaCargado}
                    </div>
                ) : (
                    'N/A'
                )}
            </td>
            <td style={tableCellStyle}>{locker.porcentajeUso}</td>
            <td style={tableCellStyle}>
            {locker.state!="Disponible" ? (
            <button onClick={() => handleViewReserva(1)}>
                Ver Reserva
            </button> ) : ('N/A')}
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
