// src/services/api.js - VERSÃO FINAL COM AUTENTICAÇÃO JWT

const API_BASE = "http://localhost:8000";

// --- FUNÇÕES DE AUTENTICAÇÃO E USUÁRIO ---

// Busca o usuário logado usando o token guardado
export async function getUsuarioLogado() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("Nenhum token encontrado");
  }

  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    localStorage.removeItem('token'); // Limpa token inválido
    throw new Error("Token inválido ou expirado");
  }

  return res.json();
}

// Processo de Login em 2 etapas: pega o token, depois busca o usuário
export async function loginUsuario(dadosLogin) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosLogin),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro no login");
  }
  
  const tokenData = await res.json();
  
  // Se recebeu o token, guarda e busca os dados do usuário
  if (tokenData.access_token) {
    localStorage.setItem('token', tokenData.access_token);
    const userData = await getUsuarioLogado();
    // Retorna o objeto que o App.jsx espera
    return { user: userData, token: tokenData.access_token };
  } else {
    throw new Error("Token não recebido do servidor");
  }
}

// --- FUNÇÕES PÚBLICAS DE REGISTRO ---

export async function registrarUsuario(dadosUsuario) {
  const res = await fetch(`${API_BASE}/registrar-usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosUsuario),
  });
  if (!res.ok) { /* ... tratamento de erro ... */ }
  return res.json();
}

export async function registrarFornecedorCompleto(data) {
  const res = await fetch(`${API_BASE}/registrar-fornecedor-completo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) { /* ... tratamento de erro ... */ }
  return res.json();
}

// --- FUNÇÕES PÚBLICAS DE LEITURA ---

export async function getProdutos() {
  const res = await fetch(`${API_BASE}/produtos`);
  return res.json();
}

export async function getFornecedores() {
  const res = await fetch(`${API_BASE}/fornecedores`);
  if (!res.ok) { throw new Error("Erro ao buscar fornecedores"); }
  return res.json();
}

// FUNÇÃO PARA BUSCAR OS DADOS DE UM ÚNICO PRODUTO
export async function getProdutoById(produtoId) {
  const res = await fetch(`${API_BASE}/produtos/${produtoId}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar os detalhes do produto");
  }
  return res.json();
}

// FUNÇÃO PARA ENVIAR A ATUALIZAÇÃO DE UM PRODUTO (PROTEGIDA)
export async function atualizarProduto(produtoId, formData) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Usuário não autenticado para atualizar produto.");

  const res = await fetch(`${API_BASE}/produtos/${produtoId}`, {
    method: 'PUT', // <-- Usando o método PUT para atualização
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao atualizar produto");
  }
  return res.json();
}


// Nova função para buscar apenas os produtos do fornecedor logado
export async function getMeusProdutos() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch(`${API_BASE}/meus-produtos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Erro ao buscar seus produtos");
  }
  return res.json();
}



// --- FUNÇÕES PROTEGIDAS (PRECISAM DO TOKEN) ---

export async function cadastrarProduto(formData) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Usuário não autenticado para cadastrar produto.");

  const res = await fetch(`${API_BASE}/produtos`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`, // <-- APRESENTANDO O CRACHÁ
    },
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao cadastrar produto");
  }
  return res.json();
}

export async function excluirProduto(produtoId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch(`${API_BASE}/produtos/${produtoId}`, {
    method: 'DELETE', // <-- Usando o método HTTP correto para exclusão
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao excluir produto");
  }
  return res.json();
}

export async function criarPedido(pedido) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Usuário não autenticado para criar pedido.");

  const res = await fetch(`${API_BASE}/pedidos`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`, // <-- APRESENTANDO O CRACHÁ
    },
    body: JSON.stringify(pedido),
  });
  if (!res.ok) { /* ... tratamento de erro ... */ }
  return res.json();
}