import React from 'react';

const HandleReserva = () => {
  //poner logica de reserva
  console.log("Buscar casilleros disponibles");
  console.log("De los disponibles, tomar los con el tamaño adecuado");
  console.log("Asignar el casillero si hay disponibles");
  console.log("Retornar casillero asignado si esque hay");
  console.log("Casillero encontrado");
}

const HandleMailOperador = () => {
  //poner logica de
  console.log("Mail enviado a OPERADOR");

}

const HandleMailCliente = () => {
  //poner logica de
  console.log("Mail enviado a CLIENTE");

}
const BotonReserva = () => {
  const manejarClick = () => {
    console.log('Reservando');
    console.log("Buscando casillero...");
    HandleReserva();
    console.log('Si existe casillero se reserva');
    console.log("Reservando casillero...");
    console.log("Reserva realizada");
    console.log("Su casillero es el 1");
    console.log("Mandando mensaje al operador y cliente...");
    HandleMailCliente();
    HandleMailOperador();
    console.log("Listo");
    console.log("\n");
  };

  return (
    <button onClick={manejarClick}>
      Reservar
    </button>
  );
};

export default BotonReserva;
