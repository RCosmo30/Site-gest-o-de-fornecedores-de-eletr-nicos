from pydantic import BaseModel

class UsuarioBase(BaseModel):
    email: str

class UsuarioCreate(UsuarioBase):
    nome: str
    senha: str

class UsuarioLogin(UsuarioBase):
    senha: str

class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: str
    is_fornecedor: bool

    class Config:
        orm_mode = True

class FornecedorCompletoCreate(BaseModel):
    nome_usuario: str
    email_usuario: str
    senha_usuario: str
    nome_empresa: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class ProdutoResponse(BaseModel):
    id: int
    nome: str
    preco: float
    imagem: str | None = None
    fornecedor_id: int

    class Config:
        from_attributes = True # Novo nome para orm_mode