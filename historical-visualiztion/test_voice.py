import requests

response = requests.post(
    "http://127.0.0.1:5001/speak",
    json={
        "text": "Hello boss, this is a Hindi voice test",
        "language": "hi"
    }
)

with open("voice.wav", "wb") as f:
    f.write(response.content)

print("Voice saved as voice.wav")