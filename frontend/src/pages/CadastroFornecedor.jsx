import { useState } from "react";
import { cadastrarFornecedor } from "../services/api";
import "../App.css";

export default function CadastroFornecedor() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cadastrarFornecedor({ nome, email, senha });
      setSuccess("Fornecedor cadastrado com sucesso!");
      setError("");
      setNome(""); setEmail(""); setSenha("");
    } catch {
      setError("Erro ao cadastrar fornecedor");
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Cadastro de Fornecedor</h2>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      
      <button type="submit">Cadastrar</button>
      {success && <span className="success">{success}</span>}
      {error && <span className="error">{error}</span>}
    </form>
  );
}

