# models.py - VERSÃO FINAL E CORRIGIDA

from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Table
from sqlalchemy.orm import declarative_base, relationship # 1. IMPORTE 'relationship' e 'Table'

Base = declarative_base()

# 2. A TABELA DE ASSOCIAÇÃO (A "PONTE")
# Esta é uma tabela especial que só guarda IDs para conectar Pedidos e Produtos.
pedido_produto_association = Table(
    "pedido_produto",
    Base.metadata,
    Column("pedido_id", ForeignKey("pedidos.id"), primary_key=True),
    Column("produto_id", ForeignKey("produtos.id"), primary_key=True),
)

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    senha = Column(String, nullable=False)
    is_fornecedor = Column(Boolean, default=False)
    fornecedor_id = Column(Integer, ForeignKey("fornecedores.id"), nullable=True)

class Fornecedor(Base):
    __tablename__ = "fornecedores"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

class Produto(Base):
    __tablename__ = "produtos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    preco = Column(Float, nullable=False)
    imagem = Column(String)
    fornecedor_id = Column(Integer, ForeignKey("fornecedores.id"))

class Pedido(Base):
    __tablename__ = "pedidos"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    total = Column(Float, nullable=False)

    # 3. A "RELATIONSHIP" (O "CORREDOR")
    # Diz ao SQLAlchemy: "um Pedido está relacionado a muitos Produtos,
    # e você pode encontrar essa conexão usando a 'ponte' pedido_produto_association".
    produtos = relationship(
        "Produto", secondary=pedido_produto_association
    )