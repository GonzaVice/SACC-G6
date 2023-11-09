import React from 'react';

const HandleReserva = () => {
  //poner logica de reserva
  console.log("Buscar casilleros disponibles")
  console.log("De los disponibles, tomar los con el tamaño adecuado")
  console.log("Asignar el casillero si hay disponibles")
  console.log("Retornar casillero asignado")
}

const BotonReserva = () => {
  const manejarClick = () => {
    console.log('Reservando');
    console.log("Buscando casillero...")
    HandleReserva()
    console.log("Casillero encontrado")
    console.log("Reservando casillero...")
    console.log("Reserva realizada")
    console.log("Su casillero es el 1")
    console.log("Mandando mensaje al operador y cliente...")
    console.log("Listo")
    console.log("\n")
  };

  return (
    <button onClick={manejarClick}>
      Reservar
    </button>
  );
};

export default BotonReserva;
