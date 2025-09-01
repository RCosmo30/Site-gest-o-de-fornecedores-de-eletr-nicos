from flask import Flask, jsonify, send_from_directory
import sqlite3
import os

app = Flask(__name__)

DATABASE = 'clientes.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Para retornar dict-like
    return conn

@app.route('/')
def listar_clientes():
    # Serve o arquivo Listar.html da mesma pasta
    return send_from_directory('.', 'Listar_clientes.html')

@app.route('/clientes_json')
def clientes_json():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM clientes')  # nome da tabela aqui
    rows = cursor.fetchall()
    conn.close()

    # Converte rows para lista de dicts
    clientes = [dict(row) for row in rows]
    return jsonify(clientes)

if __name__ == '__main__':
    app.run(debug=True)