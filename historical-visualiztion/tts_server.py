from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import requests
import base64
import io

app = Flask(__name__)
CORS(app)

SARVAM_API_KEY = "sk_mcxj5r3z_RLzoYo3WHcc4VwuiB2e46CHP"

SARVAM_URL = "https://api.sarvam.ai/text-to-speech"

MAX_CHARS = 2400  # Sarvam limit is 2500


# ---------- FUNCTION TO SPLIT LONG TEXT ----------
def split_text(text, limit=MAX_CHARS):
    parts = []
    while len(text) > limit:
        parts.append(text[:limit])
        text = text[limit:]
    parts.append(text)
    return parts


# ---------- SPEAK ROUTE ----------
@app.route("/speak", methods=["POST"])
def speak():

    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    print("TEXT LENGTH:", len(text))

    headers = {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    parts = split_text(text)

    combined_audio = b''

    for part in parts:

        payload = {
            "text": part,
            "target_language_code": "hi-IN",
            "speaker": "anushka"
        }

        response = requests.post(SARVAM_URL, headers=headers, json=payload)
        data = response.json()

        print("Sarvam response received")


        if "audios" not in data:
            return jsonify(data)

        audio_base64 = data["audios"][0]
        audio_bytes = base64.b64decode(audio_base64)

        combined_audio += audio_bytes

    return send_file(
        io.BytesIO(combined_audio),
        mimetype="audio/wav",
        as_attachment=False,
        download_name="speech.wav"
    )


# ---------- START SERVER ----------
if __name__ == "__main__":
    app.run(port=5001, debug=True)