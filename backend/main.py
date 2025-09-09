from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
from passlib.context import CryptContext

from database import SessionLocal, engine
from models import Base, Fornecedor, Produto, Pedido, Usuario

# Cria as tabelas caso ainda não existam
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependência para pegar sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =======================
# Cadastro de fornecedor
# =======================
@app.post("/fornecedores")
def cadastrar_fornecedor(nome: str = Form(...), email: str = Form(...), senha: str = Form(...), db: Session = Depends(get_db)):
    hashed_senha = pwd_context.hash(senha)
    fornecedor = Fornecedor(nome=nome, email=email, senha=hashed_senha)
    db.add(fornecedor)
    db.commit()
    db.refresh(fornecedor)
    return fornecedor

# =======================
# Login de usuário
# =======================
@app.post("/login")
def login_usuario(email: str = Form(...), senha: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user or not pwd_context.verify(senha, user.senha):
        raise HTTPException(status_code=400, detail="Usuário ou senha inválidos")
    return {"msg": f"Bem-vindo {user.nome}", "user_id": user.id}

# =======================
# Cadastro de produto
# =======================
@app.post("/produtos")
def cadastrar_produto(
    nome: str = Form(...),
    preco: float = Form(...),
    fornecedor_id: int = Form(...),
    imagem: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    caminho_imagem = f"static/{imagem.filename}"
    with open(caminho_imagem, "wb") as buffer:
        shutil.copyfileobj(imagem.file, buffer)

    produto = Produto(nome=nome, preco=preco, fornecedor_id=fornecedor_id, imagem=caminho_imagem)
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto

# =======================
# Listagem de produtos
# =======================
@app.get("/produtos")
def listar_produtos(db: Session = Depends(get_db)):
    produtos = db.query(Produto).all()
    return produtos

# =======================
# Criar pedido
# =======================
@app.post("/pedidos")
def criar_pedido(usuario_id: int = Form(...), produto_ids: list[int] = Form(...), db: Session = Depends(get_db)):
    pedido = Pedido(usuario_id=usuario_id)
    db.add(pedido)
    db.commit()
    db.refresh(pedido)

    for pid in produto_ids:
        produto = db.query(Produto).get(pid)
        if produto:
            pedido.produtos.append(produto)

    db.commit()
    db.refresh(pedido)
    return pedido

