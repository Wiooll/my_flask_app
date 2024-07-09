# app.py
from flask import Flask, request, jsonify, render_template, url_for

app = Flask(__name__)

products = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.get_json()
    product = {
        'nome': data['nome'],
        'quantidade': data['quantidade'],
        'preco': data['preco'],
        'selecionado': data['selecionado'],
        'objectId': len(products)  # Simplificação: usar o índice como ID
    }
    products.append(product)
    return jsonify({'success': True})

@app.route('/get_products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/remove_product', methods=['POST'])
def remove_product():
    data = request.get_json()
    global products
    products = [p for p in products if p['objectId'] != data['id']]
    return jsonify({'success': True})

@app.route('/remove_all_products', methods=['POST'])
def remove_all_products():
    global products
    products = []
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
