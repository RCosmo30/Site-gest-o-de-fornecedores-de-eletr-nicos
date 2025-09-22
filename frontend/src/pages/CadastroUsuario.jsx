import { useState } from "react";
// MUDANÇA 1: Importamos a função de registrar usuário
import { registrarUsuario } from "../services/api"; 
import "../App.css";

// MUDANÇA 2: Renomeamos o componente
export default function CadastroUsuario() { 
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // MUDANÇA 3: Chamamos a função específica para registrar usuário
      await registrarUsuario({ nome, email, senha });
      
      setSuccess("Usuário cadastrado com sucesso! Você já pode fazer o login.");
      
      setNome(""); 
      setEmail(""); 
      setSenha("");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar usuário");
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* MUDANÇA 4: Alteramos o título do formulário */}
      <h2>Cadastro de Usuário</h2>
      
      {/* O resto do formulário é exatamente o mesmo */}
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
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}