// src/LojaDeFotos.js
import React, { useState } from 'react';
import { fotos } from './fotos';
import './LojaDeFotos.css'; // Vamos criar este arquivo de CSS em breve

const LojaDeFotos = () => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (foto) => {
    setCarrinho([...carrinho, foto]);
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.preco, 0).toFixed(2);
  };

  return (
    <div className="loja-de-fotos">
      <h1>Minha Loja de Fotos</h1>
      
      <div className="galeria">
        {fotos.map(foto => (
          <div key={foto.id} className="foto-card">
            <img src={foto.url} alt={foto.nome} />
            <h2>{foto.nome}</h2>
            <p>{foto.descricao}</p>
            <p className="preco">R$ {foto.preco.toFixed(2)}</p>
            <button onClick={() => adicionarAoCarrinho(foto)}>
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>

      <div className="carrinho">
        <h2>Carrinho ({carrinho.length})</h2>
        {carrinho.length === 0 ? (
          <p>O carrinho está vazio.</p>
        ) : (
          <ul>
            {carrinho.map(item => (
              <li key={item.id}>
                {item.nome} - R$ {item.preco.toFixed(2)}
                <button onClick={() => removerDoCarrinho(item.id)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total: R$ {calcularTotal()}</h3>
      </div>
    </div>
  );
};

export default LojaDeFotos;