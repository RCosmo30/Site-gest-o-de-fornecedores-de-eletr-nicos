// src/pages/MeusProdutos.jsx - VERSÃO COM CARRINHO SINCRONIZADO

import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom"; // 1. IMPORTE useOutletContext
import { getMeusProdutos, excluirProduto } from "../services/api";
import "../App.css";

export default function MeusProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setCart } = useOutletContext(); // 2. PEGUE A FUNÇÃO setCart DO CONTEXTO

  useEffect(() => {
    getMeusProdutos()
      .then(data => setProdutos(data))
      .catch(err => setError(err.message || "Não foi possível carregar seus produtos."))
      .finally(() => setLoading(false));
  }, []);

  const handleExcluirProduto = async (produtoId) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.");

    if (confirmar) {
      try {
        await excluirProduto(produtoId);

        // ATUALIZA A LISTA DA PÁGINA ATUAL
        setProdutos(produtosAtuais => produtosAtuais.filter(p => p.id !== produtoId));

        // 3. AVISO PARA O "CAIXA": ATUALIZE O CARRINHO!
        // Pega o carrinho atual e cria um novo, filtrando para remover o produto excluído.
        setCart(carrinhoAtual => carrinhoAtual.filter(p => p.id !== produtoId));

      } catch (err) {
        setError(err.message || "Não foi possível excluir o produto.");
      }
    }
  };

  if (loading) return <div>Carregando produtos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="table-container">
      {/* ... (o resto do seu JSX continua exatamente o mesmo) ... */}
      <h2>Meus Produtos Cadastrados</h2>
      {error && <p className="error" style={{marginBottom: '1rem'}}>{error}</p>}

      {produtos.length === 0 ? (
        <p>Você ainda não cadastrou nenhum produto.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto.id}>
                <td>
                  <img 
                    src={`http://localhost:8000/${produto.imagem}`} 
                    alt={produto.nome} 
                    className="product-table-image"
                  />
                </td>
                <td>{produto.nome}</td>
                <td>R$ {Number(produto.preco).toFixed(2)}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-btn" 
                    onClick={() => navigate(`/editar-produto/${produto.id}`)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleExcluirProduto(produto.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}