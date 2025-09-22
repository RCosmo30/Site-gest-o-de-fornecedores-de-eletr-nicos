// src/pages/EditarProduto.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProdutoById, atualizarProduto } from "../services/api";
import "../App.css";

export default function EditarProduto() {
  // 1. Pegar o ID do produto da URL (ex: o '1' em /editar-produto/1)
  const { produtoId } = useParams();
  const navigate = useNavigate();

  // 2. Estados para guardar os dados do produto
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemAtual, setImagemAtual] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 3. useEffect para BUSCAR os dados do produto quando a página carrega
  useEffect(() => {
    getProdutoById(produtoId)
      .then(data => {
        // Preenche os campos do formulário com os dados que vieram do backend
        setNome(data.nome);
        setPreco(data.preco);
        setImagemAtual(data.imagem); // Guarda o caminho da imagem atual
        setLoading(false);
      })
      .catch(err => {
        setError("Não foi possível carregar os dados do produto.");
        setLoading(false);
      });
  }, [produtoId]); // Roda sempre que o produtoId mudar

  // 4. Função para ENVIAR as atualizações
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("preco", preco);
    // Só anexa a imagem se o usuário selecionou um novo arquivo
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      await atualizarProduto(produtoId, formData);
      setSuccess("Produto atualizado com sucesso!");
      // Após 2 segundos, volta para a lista de produtos
      setTimeout(() => {
        navigate("/meus-produtos");
      }, 2000);
    } catch (err) {
      setError(err.message || "Erro ao atualizar produto.");
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Editar Produto</h2>
      {imagemAtual && <img src={`http://localhost:8000/${imagemAtual}`} alt="Imagem atual" style={{maxWidth: '100px', margin: '0 auto 1rem'}} />}

      <label htmlFor="nome_produto">Nome do Produto</label>
      <input
        id="nome_produto"
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <label htmlFor="preco_produto">Preço</label>
      <input
        id="preco_produto"
        type="number"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        required
      />

      <label htmlFor="imagem_produto">Trocar Imagem (opcional)</label>
      <input
        id="imagem_produto"
        type="file"
        onChange={(e) => setImagem(e.target.files[0])}
      />

      <button type="submit">Salvar Alterações</button>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}