import { useEffect, useState } from "react";
import { getProdutos } from "../services/api";
import "../App.css"; // Certifique-se de que o CSS está sendo importado

export default function Home({ addToCart }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Produtos</h2>

      {/* Container com layout flex, gap e wrap */}
      <div className="home-container">
        {produtos.map((p) => (
          <div key={p.id} className="card">
            <img src={`http://localhost:8000/${p.imagem}`} alt={p.nome} />
            <p><strong>{p.nome}</strong></p>
            <p>R$ {p.preco}</p>
            <button onClick={() => addToCart(p)}>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
    </div>
  );
}

