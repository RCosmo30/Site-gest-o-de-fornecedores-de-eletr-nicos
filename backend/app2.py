from flask import Flask, request, send_file
import sqlite3
import os
import socket

app = Flask(__name__)
DB_NAME = 'clientes.db'

# Criação automática do banco
def criar_banco():
    if not os.path.exists(DB_NAME):
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                idade INTEGER NOT NULL,
                email TEXT NOT NULL,
                telefone TEXT NOT NULL,
                endereco TEXT NOT NULL,
                genero TEXT NOT NULL,
                cpf TEXT NOT NULL,
                senha TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()

# Página inicial serve o HTML direto
@app.route('/')
def index():
    return send_file('cliente.html')

# Rota para cadastro
@app.route('/cadastrar_cliente', methods=['POST'])
def cadastrar_cliente():
    try:
        nome = request.form['nome']
        idade = int(request.form['idade'])
        email = request.form['email']
        telefone = request.form['telefone']
        endereco = request.form['endereco']
        genero = request.form['genero']
        cpf = request.form['cpf']
        senha = request.form['senha']
        confirmar_senha = request.form['confirmarSenha']

        if senha != confirmar_senha:
            return '''
                <h2 style="color:red;">❌ As senhas não coincidem.</h2>
                <a href="/">Voltar ao formulário</a>
            '''

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO clientes (nome, idade, email, telefone, endereco, genero, cpf, senha)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (nome, idade, email, telefone, endereco, genero, cpf, senha))
        conn.commit()
        conn.close()

        return '''
            <h2 style="color:green;">✅ Cliente cadastrado com sucesso!</h2>
            <a href="/">🔙 Voltar ao formulário</a>
        '''

    except Exception as e:
        return f'''
            <h2 style="color:red;">Erro ao cadastrar: {e}</h2>
            <a href="/">🔙 Tentar novamente</a>
        '''

# Detecta porta livre
def porta_livre(inicio=5000, fim=5100):
    for porta in range(inicio, fim):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("127.0.0.1", porta))
                return porta
        except OSError:
            continue
    raise RuntimeError('❌ Nenhuma porta livre disponível.')

if __name__ == '__main__':
    criar_banco()
    porta = porta_livre()
    print(f'✅ Servidor rodando em http://127.0.0.1:{porta}')
    app.run(port=porta, debug=True)