// src/pages/Login.jsx - VERSÃO INTELIGENTE

import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/api";
import "../App.css";

export default function Login() {
  // Pega o 'user' e a função 'handleLogin' do contexto do App.jsx
  const { user, handleLogin } = useOutletContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  // EFEITO: Se o usuário já estiver logado, redirecione para a Home
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUsuario({ email, senha });
      handleLogin(userData);
      // A navegação agora é feita pelo App.jsx, mas mantemos aqui por segurança
      // e para o caso de o App.jsx mudar no futuro.
    } catch (err) {
      setError("Email ou senha inválidos");
    }
  };

  // Se o usuário já existe, não renderize o formulário para evitar um "flash"
  if (user) {
    return null; 
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Login</h2>
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
      <button type="submit">Entrar</button>
      {error && <span className="error">{error}</span>}
    </form>
  );
}