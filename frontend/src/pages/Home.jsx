// src/pages/Home.jsx - VERSÃO FINAL E FUNCIONAL

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom"; // 1. IMPORTAMOS O HOOK
import { getProdutos } from "../services/api";
import "../App.css";

export default function Home() {
  // 2. PEGamos a função addToCart que o App.jsx nos forneceu
  const { addToCart } = useOutletContext();

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    getProdutos()
      .then(setProdutos)
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Produtos</h2>
      <div className="home-container">
        {produtos.map((p) => (
          <div key={p.id} className="card">
            <img src={`http://localhost:8000/${p.imagem}`} alt={p.nome} />

            <div className="card-content">
              <h3>{p.nome}</h3>
              {/* Garantindo que o preço sempre tenha duas casas decimais */}
              <p className="price">R$ {Number(p.preco).toFixed(2)}</p>
            </div>

            {/* 3. O onClick agora chama a função que pegamos do contexto */}
            <button onClick={() => addToCart(p)}>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
    </div>
  );
}