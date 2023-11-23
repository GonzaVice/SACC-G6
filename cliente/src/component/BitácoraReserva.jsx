import React from "react";

const BitacoraReserva = ({reserva, estacion}) => {
  const estadoCancelacion = reserva.state === "Cancelada" ? "Cancelada" : "---";
  return (
    <div>
      <h1>Bitacora Reserva</h1>
        <h2>Estacion: {estacion}</h2>
        <div className="container">
          <p><u><strong>Usuario de la Reserva:</strong></u> {reserva.ecommerce}</p>
          <p><u><strong>Estado actual:</strong></u> {reserva.state}</p>
          <p><u><strong>Cliente:</strong></u> {reserva.cliente}</p>
          <p><u><strong>Constraseña Cliente:</strong></u> {reserva.clientePassword}</p>
          <p><u><strong>Operador:</strong></u> {reserva.operador}</p>
          <p><u><strong>Constraseña Operador:</strong></u> {reserva.operadorPassword}</p>
          <p><u><strong>Hora Reserva:</strong></u> {reserva.horaReserva}</p>
          <p><u><strong>Hora Confirmacion Reserva:</strong></u> {reserva.horaConfirmacionReserva}</p>
          <p><u><strong>Hora Confirmacion Operario:</strong></u> {reserva.horaConfirmacionOperario}</p>
          <p><u><strong>Hora Carga:</strong></u> {reserva.horaCarga}</p>
          <p><u><strong>Hora Descarga:</strong></u> {reserva.horaDescarga}</p>
          <p><u><strong>Hora Finalizacion:</strong></u> {reserva.horaFinalizacion}</p>
          <p><u><strong>Hora Cancelación:</strong></u> {estadoCancelacion}</p>
        </div>
    </div>
  );
}

export default BitacoraReserva;