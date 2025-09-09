import React from "react";

export default function Header({ user, onLogout }) {
  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>Eletrônicos Marketplace</h1>
      <nav>
        {user ? (
          <>
            <span style={styles.greeting}>Olá, {user.nome}</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <span>Você não está logado</span>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    borderBottom: "1px solid #ccc",
    marginBottom: "1rem",
  },
  logo: {
    margin: 0,
  },
  greeting: {
    marginRight: "1rem",
  },
};

