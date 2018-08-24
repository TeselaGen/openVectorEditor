from flask import Flask, jsonify, make_response, request
from flask_cors import CORS

from crispr import get_guides

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def index():
    """
    Converts POST request in JSON to dict
    Returns a list of guides in JSON format
    """

    data = request.get_json()
    guides = get_guides(data)
    return jsonify(guides)
    
if __name__ == "__main__":
    app.run()
    