from flask import Flask, request, jsonify, session
from flask_cors import CORS
import websockets
import asyncio
import json
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
data = {}

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
    input_source = data.get("source", "")
    input_confidence_level = data.get("confidenceLevel", 0)
    input_picture = data.get("picture", "")
    input_tag = data.get("customTags", [])

    print("----- NEW WORD ADDED -----")
    print(input_word, input_definition, input_explanation, input_example, input_source, input_confidence_level, input_picture, input_tag)

    socketio.emit(
        "new word",
        (input_word, input_definition, input_explanation, input_example, input_source, input_confidence_level, input_picture, input_tag),
    )
    return (
        jsonify({"status": "success", "message": "input word recieved"}),
        200,
    )

@socketio.on("sync tag")
def sync_tag(d):
    print("receive sync tag")
    global data
    data["tag"] = d["savedTags"]
    print(data["tag"])

@app.route("/api/tag", methods=["GET", "POST"])
def handle_tag():
    global data
    if request.method == "GET":
        print("getting all tags")
        print(data["tag"])
        return (jsonify({"tag": data["tag"]}), 200)
    else:
        jsonData = request.get_json()
        tag = jsonData.get("tag", "")
        if tag != "":
            print("adding new tag")
            print(tag)
            data["tag"].append(tag)
            socketio.emit("new tag", tag)
            return (jsonify({"status": "success", "message": "tag " + tag + " added"}), 200)
        else:
            return (jsonify({"status": "failure", "message": "empty tag cannot be added"}), 400)

if __name__ == "__main__":
    socketio.run(
        app, debug=True, host="0.0.0.0", port=5000
    )  # This will start the server on port 5000
