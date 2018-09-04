from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
import json

from crispr import get_guides

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def index():
    """
    Expects JSON with data and options keys
    Converts POST request in JSON to dict
    Returns a list of guides in JSON format
    """

    search = request.get_json()
    data = search.get('data')
    options = search.get('options')
    guides = get_guides(data, options)
    return jsonify(guides)
    
if __name__ == "__main__":
    app.run()
    