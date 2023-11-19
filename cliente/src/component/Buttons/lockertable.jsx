import React from 'react';

const LockerTable = ({ lockers, stationId }) => {
  return (
    <div>
      <h2>Lockers de la estación {stationId}</h2>
      <table>
        <thead>
          <tr>
            <th>Locker</th>
            <th>State</th>
            <th>Is Empty</th>
            <th>Is Open</th>
          </tr>
        </thead>
        <tbody>
          {lockers.map((locker, index) => (
            <tr key={index}>
              <td>{locker.nickname}</td>
              <td>{locker.state}</td>
              <td>{locker.is_empty.toString()}</td>
              <td>{locker.is_open.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LockerTable;