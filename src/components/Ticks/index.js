import React, { useEffect, useState } from 'react';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import './style.css';

const Ticks = () => {
  const app_id = 1089; // ID TESTE
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api = new DerivAPIBasic({ connection });

  const tickStream = () => api.subscribe({ ticks: 'R_100' }); // somente o simbolo informado por parametro

  const [ticksData, setTicksData] = useState([]);

  const listarKeys = ['symbol', 'id', 'bid', 'epoch', 'quote'];
  // {"ask":5922.01,"bid":5920.01,"epoch":1685326390,"id":"734cbe08-4c57-9419-4830-96fed4bb9257","pip_size":2,"quote":5921.01,"symbol":"R_100"}

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
    <div className="container-ticks">
        <h1 className='titulo-ticks'>Listar Ticks</h1>
        <h3 className='subtitulo-ticks'>Um tick é uma medida de movimento mínimo para cima ou para baixo no preço de uma mercadoria comercializável.</h3>
        <div className="buttons-container-ticks">
            <button className='button-ticks' id="ticks">Gerar Ticks</button>
            <button className='button-ticks' id="parar-ticks">Parar Ticks</button>
        </div>
        <ul className="ticks-list">
            {ticksData.map((tick, index) => (
              <li className='list-ticks' key={index}>
                {listarKeys.map((key) => (
                  <span className='label-tick' key={key}>{`${key}: ${tick[key]} `}</span>
                ))}
              </li>
            ))}
        </ul>
    </div>
  );
};

export default Ticks;