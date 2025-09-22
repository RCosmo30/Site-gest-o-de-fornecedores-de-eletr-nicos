// src/App.jsx - VERSÃO FINAL E COMPLETA

import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { getUsuarioLogado } from "./services/api"; 

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const verificarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getUsuarioLogado();
          setUser(userData);
        } catch (error) {
          console.error(error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false); 
    };

    verificarUsuario();
  }, []);

  const addToCart = (produto) => setCart(carrinhoAtual => [...carrinhoAtual, produto]);
  const clearCart = () => setCart([]);
  const removeFromCart = (produtoId) => {
    const indexDoProduto = cart.findIndex(item => item.id === produtoId);
    if (indexDoProduto > -1) {
      const novoCarrinho = [...cart];
      novoCarrinho.splice(indexDoProduto, 1);
      setCart(novoCarrinho);
    }
  };
  
  const handleLogin = (loginData) => {
    localStorage.setItem('token', loginData.token);
    setUser(loginData.user);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return <div>Carregando...</div>; 
  }

  return (
    <div>
      <Header user={user} onLogout={handleLogout} cartCount={cart.length} />
      <main className="main-content">
        <Outlet context={{ user, handleLogin, cart, addToCart, clearCart, setCart, removeFromCart }} />
      </main>
    </div>
  );
}

export default App;