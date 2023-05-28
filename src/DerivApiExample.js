import React, { useEffect, useState } from 'react';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import './deriv-style.css';

const DerivApiExample = () => {
  const app_id = 1089; // ID TESTE
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api = new DerivAPIBasic({ connection });

  const tickStream = () => api.subscribe({ ticks: 'R_100' }); // somente o simbolo informado por parametro

  const [ticksData, setTicksData] = useState([]);

  const tickResponse = async (res) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log('Error: ', data.error.message);
      connection.removeEventListener('message', tickResponse, false);
      await api.disconnect();
    }
    if (data.msg_type === 'tick') {
      setTicksData((prevData) => [...prevData, data.tick]);
    }
  };

  const gerarTicks = async () => {
    await tickStream();
    connection.addEventListener('message', tickResponse);
  };

  const pararTicks = () => {
    connection.removeEventListener('message', tickResponse, false);
    tickStream().unsubscribe();
  };

  useEffect(() => {
    const ticksButton = document.querySelector('#ticks');
    const pararTicksButton = document.querySelector('#parar-ticks');

    ticksButton.addEventListener('click', gerarTicks);
    pararTicksButton.addEventListener('click', pararTicks);

    return () => {
      ticksButton.removeEventListener('click', gerarTicks);
      pararTicksButton.removeEventListener('click', pararTicks);
    };
  }, []);

  return (
    <div className="container">
        <h1>Exemplo de Consumo da deriv-api</h1>
        <div className="buttons-container">
            <button id="ticks">Gerar Ticks</button>
            <button id="parar-ticks">Parar</button>
        </div>
        <ul className="ticks-list">
            {ticksData.map((tick, index) => (
                <li key={index}>{JSON.stringify(tick)}</li>
            ))}
        </ul>
    </div>
  );
};

export default DerivApiExample;