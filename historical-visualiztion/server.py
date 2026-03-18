from flask import Flask, request, jsonify
from flask_cors import CORS
from ai import ai_brain

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Historical AI Server Running"

@app.route("/ask", methods=["POST"])
def ask():

    data = request.json
    question = data.get("question")

    answer = ai_brain(question)

    return jsonify({
        "answer": answer
    })

if __name__ == "__main__":
    print("Starting Historical AI Server...")
    app.run(host="0.0.0.0", port=5000, debug=True)