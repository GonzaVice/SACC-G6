import React from "react";
import { useLocation } from 'react-router-dom';

const BitacoraReserva = () => {
  const location = useLocation();
  const { reserva } = location.state;
  console.log("RESERVA bitacioa", reserva)
  const estadoCancelacion = reserva.horaCancelacion === null ? "---" : "Canelada";
  return (
    <div>
      <h1>Bitacora Reserva</h1>
        <div className="container">
          <h2>Reserva {reserva.name}</h2>
          <p><u><strong>Cliente de la Reserva:</strong></u> {reserva.cliente}</p>
          <p><u><strong>Estado actual:</strong></u> {reserva.state}</p>
          <p><u><strong>Constraseña Cliente:</strong></u> {reserva.clientePassword}</p>
          <p><u><strong>Operador:</strong></u> {reserva.operador}</p>
          <p><u><strong>Constraseña Operador:</strong></u> {reserva.operadorPassword}</p>
          <p><u><strong>Hora Reserva:</strong></u> {reserva.datetime}</p>
          <p><u><strong>Hora Confirmacion Reserva:</strong></u> {reserva.horaConfirmacionReserva}</p>
          <p><u><strong>Hora Confirmacion Operario:</strong></u> {reserva.horaConfirmacionOperador}</p>
          <p><u><strong>Hora Carga:</strong></u> {reserva.horaCarga}</p>
          <p><u><strong>Hora Descarga:</strong></u> {reserva.horaDescarga}</p>
          <p><u><strong>Hora Finalizacion:</strong></u> {reserva.horaFinalizacion}</p>
          <p><u><strong>Hora Cancelación:</strong></u> {estadoCancelacion}</p>
        </div>
    </div>
  );
}

export default BitacoraReserva;