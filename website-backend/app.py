from flask import Flask, request, jsonify
from flask_cors import CORS
import websockets
import asyncio
import json

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return "my API"


# async def handle_message(websocket, path):
#     while True:
#         message = await websocket.recv()
#         data = json.loads(message)

#         # Extract the word data from the received message
#         input_word = data.get("word", "")
#         input_definition = data.get("definition", "")
#         input_explanation = data.get("explanation", "")
#         input_example = data.get("example", "")
#         input_tag = data.get("tag", "")

#         # Store the word data in a dictionary
#         word_data = {
#             "word": input_word,
#             "definition": input_definition,
#             "explanation": input_explanation,
#             "example": input_example,
#             "tag": input_tag,
#         }
#         # Send the updated word data to all connected clients
#         for client in websockets:
#             await client.send(json.dumps(word_data))


# start_server = websockets.serve(handle_message, "localhost", 8765)

# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()


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
    return (
        jsonify({"status": "success", "message": "input word recieved"}),
        200,
    )


if __name__ == "__main__":
    app.run(
        debug=True, host="0.0.0.0", port=5000
    )  # This will start the server on port 5000
