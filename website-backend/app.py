from flask import Flask, request, jsonify
from flask_cors import CORS
import websockets
import asyncio
import json
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/", methods=["GET"])
def home():
    return "my API"


@app.route("/api/addterm", methods=["POST"])
def receive_entry():
    data = request.get_json()
    input_word = data.get("word", "")
    input_definition = data.get("definition", "")
    input_explanation = data.get("explanation", "")
    input_example = data.get("example", "")
    input_tag = data.get("tag", "")
    print("!!!!!!!!!!!!!!!")
    print(input_word, input_definition, input_explanation, input_example, input_tag)
    socketio.emit(
        "new word",
        (input_word, input_definition, input_explanation, input_example, input_tag),
    )
    return (
        jsonify({"status": "success", "message": "input word recieved"}),
        200,
    )


if __name__ == "__main__":
    socketio.run(
        app, debug=True, host="0.0.0.0", port=5000
    )  # This will start the server on port 5000
