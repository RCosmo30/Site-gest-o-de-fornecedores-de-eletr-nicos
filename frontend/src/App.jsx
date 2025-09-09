import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroFornecedor from "./pages/CadastroFornecedor";
import CadastroProduto from "./pages/CadastroProduto";
import Carrinho from "./pages/Carrinho";
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (produto) => setCart([...cart, produto]);
  const clearCart = () => setCart([]);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <div>
      {/* Header sempre visível */}
      <Header user={user} onLogout={handleLogout} />

      {/* Home sempre visível */}
      <Home addToCart={addToCart} />

      {/* Funcionalidades protegidas */}
      {user && (
        <>
          <CadastroFornecedor />
          <CadastroProduto />
          <Carrinho cart={cart} clearCart={clearCart} />
        </>
      )}

      {/* Login apenas para usuários não logados */}
      {!user && <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;

