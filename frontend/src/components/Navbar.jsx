import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
      <Link to="/">Home</Link>
      <Link to="/cadastro-fornecedor">Cadastro Fornecedor</Link>
      <Link to="/cadastro-produto">Cadastro Produto</Link>
      <Link to="/carrinho">Carrinho</Link>
    </nav>
  );
}

