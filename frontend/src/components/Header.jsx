// src/components/Header.jsx - VERSÃO COM "CLICK OUTSIDE TO CLOSE"

import { useState, useEffect, useRef } from 'react'; // 1. IMPORTAMOS useEffect e useRef
import { Link } from 'react-router-dom';
import '../App.css'; 

export default function Header({ user, onLogout, cartCount }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 2. CRIAMOS A REFERÊNCIA (O "RG") PARA O NOSSO MENU
  const dropdownRef = useRef(null);

  // 3. O useEffect COM A LÓGICA DE "CLIQUE FORA"
  useEffect(() => {
    // A função que será chamada a cada clique na página
    function handleClickOutside(event) {
      // Se a nossa referência existe E o local clicado NÃO está dentro dela...
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // ...então feche o menu.
      }
    }

    // Adiciona o "espião" de cliques no documento inteiro
    document.addEventListener("mousedown", handleClickOutside);

    // 4. A FUNÇÃO DE LIMPEZA
    // Isso é executado quando o componente "morre" para evitar vazamento de memória
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]); // O efeito depende da nossa referência

  return (
    <header>
      <h1>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Eletrônicos Marketplace
        </Link>
      </h1>

      <nav>
        {user ? (
          <>
            <Link to="/carrinho">Carrinho ({cartCount || 0})</Link>

            {/* 5. ATRIBUÍMOS O "RG" (ref) AO CONTAINER DO MENU */}
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-menu-button" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Olá, {user.nome} ▼
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  {user.is_fornecedor && (
                    <>
                      <Link to="/cadastro-produto" onClick={() => setDropdownOpen(false)}>
                        Cadastrar Produto
                      </Link>
                      <Link to="/meus-produtos" onClick={() => setDropdownOpen(false)}>
                        Meus Produtos
                      </Link>
                    </>
                  )}
                  <button onClick={() => { onLogout(); setDropdownOpen(false); }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/cadastro-usuario">Cadastrar Usuário</Link>
            <Link to="/cadastro-fornecedor">Cadastrar Fornecedor</Link>
          </>
        )}
      </nav>
    </header>
  );
}