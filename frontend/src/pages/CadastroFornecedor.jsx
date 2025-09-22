import { useState } from "react";
import { registrarFornecedorCompleto } from "../services/api";
import "../App.css";

export default function CadastroFornecedor() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [senhaUsuario, setSenhaUsuario] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState(""); // <-- NOVO ESTADO

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        nome_usuario: nomeUsuario,
        email_usuario: emailUsuario,
        senha_usuario: senhaUsuario,
        nome_empresa: nomeEmpresa,
      };
      await registrarFornecedorCompleto(dados);
      setSuccess("Cadastro realizado com sucesso! Você já pode fazer o login.");
      // Limpa todos os campos
      setNomeUsuario("");
      setEmailUsuario("");
      setSenhaUsuario("");
      setNomeEmpresa("");
    } catch (err) {
      setError(err.message || "Erro ao realizar cadastro.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Cadastro de Fornecedor</h2>

      <h4>Dados da Conta</h4>
      <input
        type="text"
        placeholder="Seu Nome Completo"
        value={nomeUsuario}
        onChange={(e) => setNomeUsuario(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Seu E-mail de Login"
        value={emailUsuario}
        onChange={(e) => setEmailUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Sua Senha"
        value={senhaUsuario}
        onChange={(e) => setSenhaUsuario(e.target.value)}
        required
      />

      <hr style={{width: '100%', margin: '1rem 0'}} />

      {/* NOVO CAMPO AQUI */}
      <h4>Dados da Empresa</h4>
      <input
        type="text"
        placeholder="Nome da Empresa"
        value={nomeEmpresa}
        onChange={(e) => setNomeEmpresa(e.target.value)}
        required
      />

      <button type="submit">Finalizar Cadastro</button>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}