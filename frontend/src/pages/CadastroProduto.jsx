import { useState } from "react";
import { cadastrarProduto } from "../services/api";
import "../App.css";

export default function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("preco", preco);
      formData.append("imagem", imagem);

      await cadastrarProduto(formData);
      setSuccess("Produto cadastrado com sucesso!");
      setError("");
      setNome(""); setPreco(""); setImagem(null);
    } catch {
      setError("Erro ao cadastrar produto");
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Cadastro de Produto</h2>
      <input
        type="text"
        placeholder="Nome do produto"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Preço"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setImagem(e.target.files[0])}
        required
      />
      <button type="submit">Cadastrar</button>
      {success && <span className="success">{success}</span>}
      {error && <span className="error">{error}</span>}
    </form>
  );
}

