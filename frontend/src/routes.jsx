import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App"; // Importa o componente App que serve como layout
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroFornecedor from "./pages/CadastroFornecedor";
import CadastroProduto from "./pages/CadastroProduto";
import Carrinho from "./pages/Carrinho";
import CadastroUsuario from "./pages/CadastroUsuario";
import RotaProtegida from "./components/RotaProtegida";
import MeusProdutos from "./pages/MeusProdutos"; 
import EditarProduto from "./pages/EditarProduto";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* ROTA PAI: TUDO o que precisa do contexto (user, cart, etc.) vai AQUI DENTRO */}
        <Route path="/" element={<App />}>

          {/* --- ROTAS PÚBLICAS (Filhas do App) --- */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="carrinho" element={<Carrinho />} />
          <Route path="cadastro-usuario" element={<CadastroUsuario />} />
          <Route path="cadastro-fornecedor" element={<CadastroFornecedor />} />

          {/* --- ROTAS PROTEGIDAS (Também Filhas do App) --- */}
          <Route element={<RotaProtegida />}>
            <Route path="cadastro-produto" element={<CadastroProduto />} />
            <Route path="editar-produto/:produtoId" element={<EditarProduto />} />
            <Route path="meus-produtos" element={<MeusProdutos />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}