from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Usuario
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Cria a sessão do banco
db: Session = SessionLocal()

# Defina os dados do admin
admin_email = "admin@admin.com"
admin_nome = "Admin"
admin_senha = pwd_context.hash("admin123")  # senha pode ser alterada

# Verifica se já existe
usuario_existente = db.query(Usuario).filter(Usuario.email == admin_email).first()
if usuario_existente:
    print("Usuário admin já existe.")
else:
    admin = Usuario(nome=admin_nome, email=admin_email, senha=admin_senha, is_fornecedor=True)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print(f"Usuário admin criado com sucesso: {admin_email}")

db.close()

