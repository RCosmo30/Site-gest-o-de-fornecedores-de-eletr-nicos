from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, status # <-- MUDANÇA: Adicionado 'status'
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles 
from sqlalchemy.orm import Session
import shutil, typing
from passlib.context import CryptContext
from typing import Optional 

# Nossos módulos
from database import SessionLocal, engine, get_db 
from models import Base, Fornecedor, Produto, Pedido, Usuario
import schemas 
import auth

# Cria as tabelas caso ainda não existam
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =======================
# Endpoint para REGISTRAR UM CLIENTE
# =======================
@app.post("/registrar-usuario", response_model=schemas.UsuarioResponse) # <-- MUDANÇA: Adicionado response_model
def registrar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)): # <-- MUDANÇA: Usando schemas.UsuarioCreate
    db_user = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail já registrado")

    hashed_senha = pwd_context.hash(usuario.senha)
    
    db_usuario = Usuario(
        nome=usuario.nome, 
        email=usuario.email, 
        senha=hashed_senha,
        is_fornecedor=False 
    )
    
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# =======================
# Endpoint para REGISTRO COMPLETO DE FORNECEDOR (Usuário + Empresa)
# =======================
@app.post("/registrar-fornecedor-completo", response_model=schemas.UsuarioResponse)
def registrar_fornecedor_completo(dados: schemas.FornecedorCompletoCreate, db: Session = Depends(get_db)):
    usuario_existente = db.query(Usuario).filter(Usuario.email == dados.email_usuario).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="O e-mail para a conta de usuário já está em uso.")

    # 1. Cria a ENTIDADE FORNECEDOR (a empresa)
    db_fornecedor = Fornecedor(nome=dados.nome_empresa, email=dados.email_usuario)
    db.add(db_fornecedor)

    # 2. Pré-salva no banco para que o db_fornecedor receba um ID
    db.flush()

    # 3. Cria a CONTA DE USUÁRIO com permissão de fornecedor e o VÍNCULO
    hashed_senha = pwd_context.hash(dados.senha_usuario)
    db_usuario = Usuario(
        nome=dados.nome_usuario,
        email=dados.email_usuario,
        senha=hashed_senha,
        is_fornecedor=True,
        fornecedor_id=db_fornecedor.id # <-- A CORREÇÃO CRUCIAL ESTÁ AQUI
    )
    db.add(db_usuario)

    # 4. Salva tudo no banco de dados
    db.commit()
    db.refresh(db_usuario)
    return db_usuario
    
# =======================
# Login de usuário
# =======================
@app.post("/login", response_model=schemas.Token)
def login_usuario(usuario_login: schemas.UsuarioLogin, db: Session = Depends(get_db)):
  
    user = db.query(Usuario).filter(Usuario.email == usuario_login.email).first()

    if not user or not pwd_context.verify(usuario_login.senha, user.senha):
       
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
   
    access_token = auth.create_access_token(
        data={"sub": user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# =======================
# Buscar um único produto por ID
# =======================
@app.get("/produtos/{produto_id}", response_model=schemas.ProdutoResponse)
def ler_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

# =======================
# Endpoint para buscar dados do usuário logado
# =======================
@app.get("/users/me", response_model=schemas.UsuarioResponse)
def read_users_me(current_user: Usuario = Depends(auth.get_current_user)):
    """
    Retorna os dados do usuário atualmente autenticado.
    """
    return current_user

# =======================
# Atualizar um produto - ROTA PROTEGIDA
# =======================
@app.put("/produtos/{produto_id}", response_model=schemas.ProdutoResponse)
def atualizar_produto(
    produto_id: int,
    nome: str = Form(...),
    preco: float = Form(...),
    imagem: Optional[UploadFile] = File(None), # A imagem é opcional na atualização
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(auth.get_current_user)
):
    # 1. Busca o produto no banco
    db_produto_query = db.query(Produto).filter(Produto.id == produto_id)
    db_produto = db_produto_query.first()

    if not db_produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")

    # 2. AUTORIZAÇÃO: Verifica se o produto pertence ao fornecedor logado
    if not current_user.is_fornecedor or db_produto.fornecedor_id != current_user.fornecedor_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado: Você não tem permissão para editar este produto.")

    # 3. Atualiza os dados do produto
    update_data = {"nome": nome, "preco": preco}

    # 4. Se uma nova imagem foi enviada, processa e atualiza o caminho
    if imagem:
        caminho_imagem = f"static/{imagem.filename}"
        with open(caminho_imagem, "wb") as buffer:
            shutil.copyfileobj(imagem.file, buffer)
        update_data["imagem"] = caminho_imagem

    db_produto_query.update(update_data, synchronize_session=False)
    db.commit()

    # Retorna o produto com os dados atualizados
    return db_produto

# =======================
# Cadastro de produto - ROTA PROTEGIDA
# =======================
@app.post("/produtos")
def cadastrar_produto(
    nome: str = Form(...),
    preco: float = Form(...),
    fornecedor_id: int = Form(...),
    imagem: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(auth.get_current_user) # <-- MUDANÇA: Rota protegida!
):
    # <-- MUDANÇA: Verificação de permissão
    if not current_user.is_fornecedor:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Apenas fornecedores podem cadastrar produtos.")

    caminho_imagem = f"static/{imagem.filename}"
    with open(caminho_imagem, "wb") as buffer:
        shutil.copyfileobj(imagem.file, buffer)

    produto = Produto(nome=nome, preco=preco, fornecedor_id=fornecedor_id, imagem=caminho_imagem)
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto

# =======================
# Excluir um produto - ROTA PROTEGIDA
# =======================
@app.delete("/produtos/{produto_id}")
def excluir_produto(
    produto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(auth.get_current_user)
):
    # 1. Encontrar o produto que se quer excluir no banco de dados
    produto_query = db.query(Produto).filter(Produto.id == produto_id)
    produto = produto_query.first()

    if not produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")

    # 2. VERIFICAÇÃO DE AUTORIZAÇÃO: O produto pertence ao fornecedor logado?
    #    Isso impede que o Fornecedor A apague os produtos do Fornecedor B.
    if not current_user.is_fornecedor or produto.fornecedor_id != current_user.fornecedor_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado: Você não tem permissão para excluir este produto.")

    # 3. Se tudo estiver certo, excluir o produto
    produto_query.delete(synchronize_session=False)
    db.commit()

    return {"mensagem": "Produto excluído com sucesso!"}

# =======================
# Listagem de produtos
# =======================
@app.get("/produtos")
def listar_produtos(db: Session = Depends(get_db)):
    produtos = db.query(Produto).all()
    return produtos


# =======================
# Listagem de Produtos do Fornecedor Logado - ROTA PROTEGIDA
# =======================
@app.get("/meus-produtos", response_model=list[schemas.ProdutoResponse]) # Usando um schema de resposta
def listar_meus_produtos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(auth.get_current_user)
):
    # 1. Verifica se o usuário logado é um fornecedor e tem uma empresa vinculada
    if not current_user.is_fornecedor or not current_user.fornecedor_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado.")

    # 2. Busca os produtos cujo 'fornecedor_id' é igual ao da empresa do usuário logado
    produtos = db.query(Produto).filter(Produto.fornecedor_id == current_user.fornecedor_id).all()

    return produtos

# =======================
# Listagem de Fornecedores (Empresas)
# =======================
@app.get("/fornecedores")
def listar_fornecedores(db: Session = Depends(get_db)):
    fornecedores = db.query(Fornecedor).all()
    return fornecedores
    
# =======================
# Criar pedido - ROTA PROTEGIDA
# =======================
@app.post("/pedidos")
def criar_pedido(
    produto_ids: list[int] = Form(...), 
    db: Session = Depends(get_db), 
    current_user: Usuario = Depends(auth.get_current_user) # <-- MUDANÇA: Rota protegida!
):
    # <-- MUDANÇA: Usando o ID do usuário logado
    usuario_id = current_user.id 

    total_pedido = 0.0
    produtos_do_pedido = []
    for pid in produto_ids:
        produto = db.query(Produto).get(pid)
        if produto:
            produtos_do_pedido.append(produto)
            total_pedido += produto.preco
    
    if not produtos_do_pedido:
        raise HTTPException(status_code=404, detail="Nenhum produto válido encontrado para o pedido.")

    pedido = Pedido(usuario_id=usuario_id, total=total_pedido)
    
    pedido.produtos.extend(produtos_do_pedido)

    db.add(pedido)
    db.commit()
    db.refresh(pedido)
    
    return {
        "id": pedido.id,
        "usuario_id": pedido.usuario_id,
        "total": pedido.total,
        "produtos": [{"id": p.id, "nome": p.nome, "preco": p.preco} for p in pedido.produtos]
    }