// src/pages/Carrinho.jsx - VERSÃO FINAL COM BOTÃO DE REMOVER

import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { criarPedido } from "../services/api";
import "../App.css";

export default function Carrinho() {
  // 1. PEGUE A NOVA FUNÇÃO 'removeFromCart' DO CONTEXTO
  const { cart, user, clearCart, removeFromCart } = useOutletContext();
  
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const total = cart.reduce((acc, produto) => acc + Number(produto.preco), 0);

  const handleFinalizarCompra = async () => {
    setError("");
    setSuccess("");

    if (!user) {
      setError("Você precisa estar logado para finalizar a compra.");
      return;
    }

    if (cart.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }

    try {
      const produto_ids = cart.map(produto => produto.id);
      
      // No backend, o endpoint 'criar_pedido' agora espera FormData
      // Vamos criar um FormData e adicionar os IDs
      const formData = new FormData();
      produto_ids.forEach(id => formData.append('produto_ids', id));

      await criarPedido(formData);

      setSuccess("Pedido realizado com sucesso!");
      clearCart();
    } catch (err) {
      setError(err.message || "Ocorreu um erro ao finalizar o pedido.");
    }
  };

  return (
    <div className="cart-container">
      <h2>Carrinho de Compras</h2>

      {success && (
        <div className="success-box">
          <p>{success}</p>
          <Link to="/">Voltar para a Home</Link>
        </div>
      )}

      {!success && (
        <>
          {cart.length === 0 ? (
            <p>O carrinho está vazio.</p>
          ) : (
            <div className="cart-items">
              {cart.map((produto, index) => (
                <div key={`${produto.id}-${index}`} className="cart-item">
                  <img src={`http://localhost:8000/${produto.imagem}`} alt={produto.nome} />
                  <div className="item-details">
                    <h4>{produto.nome}</h4>
                    <p>R$ {Number(produto.preco).toFixed(2)}</p>
                  </div>
                  {/* 2. ADICIONE O BOTÃO DE REMOVER AQUI */}
                  <button 
                    className="remove-item-btn" 
                    onClick={() => removeFromCart(produto.id)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="cart-summary">
              <h3>Total: R$ {total.toFixed(2)}</h3>
              <button onClick={handleFinalizarCompra}>Finalizar Compra</button>
              {error && <p className="error">{error}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}