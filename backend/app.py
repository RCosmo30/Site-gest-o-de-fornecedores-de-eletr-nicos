import os
import sqlite3
import socket
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

# Caminho do banco de dados
PASTA_PROJETO = os.path.dirname(os.path.abspath(__file__))
CAMINHO_BANCO = os.path.join(PASTA_PROJETO, "fornecedores.db")

# ==============================
# Criação segura do banco
# ==============================
def criar_banco():
    conn = sqlite3.connect(CAMINHO_BANCO)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS fornecedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            razao TEXT NOT NULL,
            cpfcnpj TEXT NOT NULL,
            idade INTEGER,
            telefone TEXT NOT NULL,
            email TEXT NOT NULL,
            endereco TEXT NOT NULL,
            site TEXT,
            servico TEXT NOT NULL,
            tempo TEXT NOT NULL,
            contrato TEXT NOT NULL,
            responsavel TEXT NOT NULL,
            obs TEXT
        )
    ''')
    conn.commit()
    conn.close()

criar_banco()

# ==============================
# Página inicial (HTML)
# ==============================
@app.route("/")
def index():
    return send_from_directory(PASTA_PROJETO, "cadastro.html")

# ==============================
# Cadastro com validação segura
# ==============================
@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    try:
        # Coleta e sanitiza os dados
        def limpar(campo):
            return request.form.get(campo, "").strip()

        dados = {
            "nome": limpar("nome"),
            "razao": limpar("razao"),
            "cpfcnpj": limpar("cpfcnpj"),
            "idade": limpar("idade"),
            "telefone": limpar("telefone"),
            "email": limpar("email"),
            "endereco": limpar("endereco"),
            "site": limpar("site"),
            "servico": limpar("servico"),
            "tempo": limpar("tempo"),
            "contrato": limpar("contrato"),
            "responsavel": limpar("responsavel"),
            "obs": limpar("obs")
        }

        # Campos obrigatórios
        obrigatorios = ["nome", "razao", "cpfcnpj", "telefone", "email", "endereco", "servico", "tempo", "contrato", "responsavel"]
        for campo in obrigatorios:
            if not dados[campo]:
                return jsonify({"status": "erro", "mensagem": f"O campo '{campo}' é obrigatório."}), 400

        # Validação de idade
        idade = None
        if dados["idade"]:
            if not dados["idade"].isdigit():
                return jsonify({"status": "erro", "mensagem": "Idade deve conter apenas números."}), 400
            idade = int(dados["idade"])
            if idade < 18 or idade > 120:
                return jsonify({"status": "erro", "mensagem": "Idade inválida. Deve estar entre 18 e 120."}), 400

        # Substituir string da idade pela versão inteira ou None
        dados["idade"] = idade

        # Inserção segura com placeholders
        conn = sqlite3.connect(CAMINHO_BANCO)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO fornecedores (
                nome, razao, cpfcnpj, idade, telefone, email, endereco,
                site, servico, tempo, contrato, responsavel, obs
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            dados["nome"], dados["razao"], dados["cpfcnpj"], dados["idade"], dados["telefone"],
            dados["email"], dados["endereco"], dados["site"], dados["servico"], dados["tempo"],
            dados["contrato"], dados["responsavel"], dados["obs"]
        ))
        conn.commit()
        conn.close()

        return jsonify({"status": "ok", "mensagem": "Cadastro realizado com sucesso!"})
    
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": f"Erro interno: {str(e)}"}), 500

# ==============================
# Inicializa o servidor na próxima porta livre
# ==============================
def encontrar_porta_livre(porta_inicial=5000):
    porta = porta_inicial
    while porta < 5100:  # Limite de tentativas
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('localhost', porta)) != 0:
                return porta
            porta += 1
    raise RuntimeError("Nenhuma porta livre encontrada")

if __name__ == "__main__":
    porta_livre = encontrar_porta_livre()
    print(f"Servidor iniciado em http://localhost:{porta_livre}")
    app.run(debug=True, host="0.0.0.0", port=porta_livre)