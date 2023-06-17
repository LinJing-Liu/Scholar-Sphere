from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return "my API"


@app.route("/api/addterm", methods=["POST"])
def receive_entry():
    data = request.get_json()
    input_word = data.get("word", "no word")
    input_definition = data.get("definition", "no def")
    input_explanation = data.get("explanation", "no exp")
    input_example = data.get("example", "no ex")
    input_tag = data.get("tag", "no tag")
    print("!!!!!!!!!!!!!!!")
    print(input_word, input_definition, input_explanation, input_example, input_tag)
    return (
        jsonify({"status": "success", "message": "input word recieved"}),
        200,
    )


if __name__ == "__main__":
    app.run(
        debug=True, host="0.0.0.0", port=5000
    )  # This will start the server on port 5000
