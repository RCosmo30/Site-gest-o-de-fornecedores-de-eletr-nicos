from fastapi import FastAPI
from app.routers import auth, fornecedores, produtos, pedidos

app = FastAPI(title="Marketplace de Fornecedores")

# Registrando rotas
app.include_router(auth.router)
app.include_router(fornecedores.router)
app.include_router(produtos.router)
app.include_router(pedidos.router)

