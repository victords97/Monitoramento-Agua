from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/dados', methods=['GET'])
def get_dados():
    dados = {
        "temperatura": round(random.uniform(20, 30), 2),
        "ph": round(random.uniform(6, 9), 2),
        "turbidez": round(random.uniform(1, 10), 2)
    }
    return jsonify(dados)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

