const API_BASE = "http://localhost:8000";

export async function loginUsuario(data) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)  // Envia email e senha em JSON
  });
  return res.json();
}

export async function cadastrarFornecedor(data) {
  const res = await fetch(`${API_BASE}/fornecedores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function cadastrarProduto(formData) {
  const res = await fetch(`${API_BASE}/produtos`, {
    method: "POST",
    body: formData
  });
  return res.json();
}

export async function getProdutos() {
  const res = await fetch(`${API_BASE}/produtos`);
  return res.json();
}

export async function criarPedido(pedido) {
  const res = await fetch(`${API_BASE}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
  });
  return res.json();
}

