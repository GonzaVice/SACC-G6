import {React, useState} from 'react';

const TablaEstacion = ({ data }) => {

  const handleViewReserva = (station) => {
    console.log(`Redirigiendo a Reserva ${station.address}`);
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
      {data.map((casillero) => (
        <tr key={casillero.id}>
            <td style={tableCellStyle}>{casillero.id}</td>
            <td style={tableCellStyle}>{dimensionesString(casillero.height, casillero.width, casillero.length)}</td>
            <td style={tableCellStyle}>{casillero.state}</td>
            <td style={tableCellStyle}>casillero.ocupado</td>
            <td style={tableCellStyle}>casillero.abierto</td>
            <td style={tableCellStyle}>
                {casillero.reservado ? (
                    <div key={casillero.reservations[casillero.reservations.length - 1].horaReserva}>
                    {casillero.reservations[casillero.reservations.length - 1].horaReserva}
                    </div>
                ) : (
                    'N/A'
                )}
            </td>
            <td style={tableCellStyle}>
                {casillero.reservado ? (
                    <div key={casillero.reservations[casillero.reservations.length - 1].horaCargado}>
                    {casillero.reservations[casillero.reservations.length - 1].horaCargado}
                    </div>
                ) : (
                    'N/A'
                )}
            </td>
            <td style={tableCellStyle}>{casillero.porcentajeUso}</td>
            <td style={tableCellStyle}>
            {casillero.state!="Disponible" ? (
            <button onClick={() => handleViewReserva(casillero.idReserva)}>
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
