import React from "react";
import "../App.css";

export default function Carrinho({ cart, clearCart }) {
  const total = cart.reduce((acc, p) => acc + Number(p.preco), 0);

  return (
    <div className="home-container">
      <h2>Carrinho de Compras</h2>
      {cart.length === 0 ? (
        <p>O carrinho está vazio</p>
      ) : (
        <>
          {cart.map((p, index) => (
            <div key={index} className="card">
              <img src={`http://localhost:8000/${p.imagem}`} alt={p.nome} />
              <p>{p.nome}</p>
              <p>R$ {p.preco}</p>
            </div>
          ))}
          <h3>Total: R$ {total}</h3>
          <button onClick={clearCart}>Finalizar Compra</button>
        </>
      )}
    </div>
  );
}

