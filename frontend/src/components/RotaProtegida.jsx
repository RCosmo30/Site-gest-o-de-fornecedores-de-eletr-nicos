// src/components/RotaProtegida.jsx - VERSÃO COM VERIFICAÇÃO RIGOROSA

import { useOutletContext, Navigate, Outlet } from "react-router-dom";

export default function RotaProtegida() {
  const context = useOutletContext();
  const { user } = context;

  console.log("RotaProtegida está verificando este usuário:", user);

  // --- LÓGICA DE VERIFICAÇÃO ATUALIZADA ---
  // Verificamos:
  // 1. Se NÃO existe um usuário
  // 2. OU se o usuário NÃO tem a propriedade 'is_fornecedor'
  // 3. OU se a propriedade 'is_fornecedor' NÃO é estritamente 'true' E também NÃO é o número 1
  if (!user || !user.hasOwnProperty('is_fornecedor') || (user.is_fornecedor !== true && user.is_fornecedor !== 1) ) {

    console.log("Redirecionando! Condição de bloqueio foi atendida."); // Log para depuração
    return <Navigate to="/" replace />;
  }

  // Se passou pela verificação, o acesso é liberado.
  console.log("Acesso liberado!"); // Log para depuração
  return <Outlet context={context} />;
}