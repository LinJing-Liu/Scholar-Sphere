from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return "my API"


@app.route("/api/endpoint", methods=["POST"])
def receive_data():
    data = request.json
    print(data)  # This will print the JSON body sent from your extension
    return "Data received!", 200


if __name__ == "__main__":
    app.run(
        debug=True, host="0.0.0.0", port=5000
    )  # This will start the server on port 5000
