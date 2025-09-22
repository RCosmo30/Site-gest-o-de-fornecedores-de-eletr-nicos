// src/pages/CadastroProduto.jsx - VERSÃO FINAL E COMPLETA

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
// 1. IMPORTAMOS AS FUNÇÕES NECESSÁRIAS DA NOSSA API
import { cadastrarProduto, getFornecedores } from "../services/api";
import "../App.css";

export default function CadastroProduto() {
  const { user } = useOutletContext();

  // 2. ESTADOS NOVOS PARA A LISTA E A SELEÇÃO
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("");

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 3. EFEITO PARA BUSCAR OS FORNECEDORES QUANDO A PÁGINA CARREGA
  useEffect(() => {
    getFornecedores()
      .then(data => {
        setFornecedores(data);
        // Pré-seleciona o primeiro fornecedor da lista
        if (data.length > 0) {
          setFornecedorSelecionado(data[0].id);
        }
      })
      .catch(() => setError("Erro ao carregar a lista de fornecedores."));
  }, []); // Array vazio [] garante que rode apenas uma vez

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fornecedorSelecionado) {
      setError("Por favor, selecione um fornecedor.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("preco", preco);
      formData.append("imagem", imagem);
      // 4. AQUI ESTÁ A MÁGICA: ENVIANDO O ID DO FORNECEDOR SELECIONADO
      formData.append("fornecedor_id", fornecedorSelecionado);

      await cadastrarProduto(formData);
      setSuccess("Produto cadastrado com sucesso!");
      // Limpa o formulário
      setNome("");
      setPreco("");
      setImagem(null);
    } catch (err) {
      setError(err.message || "Erro ao cadastrar produto");
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Cadastro de Produto</h2>

      {/* 5. O NOVO MENU DROPDOWN */}
      <label htmlFor="fornecedor">Empresa Fornecedora</label>
      <select
        id="fornecedor"
        value={fornecedorSelecionado}
        onChange={(e) => setFornecedorSelecionado(e.target.value)}
        required
      >
        <option value="" disabled>Selecione...</option>
        {/* Mapeia a lista de fornecedores para criar as opções */}
        {fornecedores.map(fornecedor => (
          <option key={fornecedor.id} value={fornecedor.id}>
            {fornecedor.nome}
          </option>
        ))}
      </select>

      {/* --- O resto do formulário --- */}
      <label htmlFor="nome_produto">Nome do Produto</label>
      <input
        id="nome_produto"
        type="text"
        placeholder="Nome do produto"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <label htmlFor="preco_produto">Preço</label>
      <input
        id="preco_produto"
        type="number"
        placeholder="Preço"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        required
      />
      <label htmlFor="imagem_produto">Imagem</label>
      <input
        id="imagem_produto"
        type="file"
        onChange={(e) => setImagem(e.target.files[0])}
        required
      />
      <button type="submit">Cadastrar</button>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}