import requests
import base64
import simpleaudio as sa
from deep_translator import GoogleTranslator

API_KEY = "sk_mcxj5r3z_RLzoYo3WHcc4VwuiB2e46CHP"

url = "https://api.sarvam.ai/text-to-speech"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# English input
text = input("Enter English text: ")

# Translate English → Hindi
translated = GoogleTranslator(source='en', target='hi').translate(text)

print("Hindi Translation:", translated)

data = {
    "inputs": [translated],
    "target_language_code": "hi-IN"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

audio_base64 = result["audios"][0]
audio_bytes = base64.b64decode(audio_base64)

with open("output.wav", "wb") as f:
    f.write(audio_bytes)

print("Playing Hindi voice...")

wave_obj = sa.WaveObject.from_wave_file("output.wav")
play_obj = wave_obj.play()
play_obj.wait_done()