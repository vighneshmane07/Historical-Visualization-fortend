import requests
import os

API_KEY = ""

text_folder = "data/texts"
scene_folder = "data/scenes"

os.makedirs(scene_folder, exist_ok=True)

# Get all text files
files = [f for f in os.listdir(text_folder) if f.endswith(".txt")]

if not files:
    print("❌ No history files found.")
    exit()

# Show files to user
print("\nAvailable history files:\n")

for i, file in enumerate(files):
    print(f"{i+1}. {file}")

# Ask user to choose
choice = int(input("\nEnter the number of the file to generate scenes: "))

selected_file = files[choice - 1]

file_path = os.path.join(text_folder, selected_file)

# Read history
with open(file_path, "r", encoding="utf-8") as f:
    history = f.read()

prompt = f"""
Convert this historical description into 5 cinematic scenes
for a historical 3D reconstruction video.

History:
{history}
"""

url = "https://openrouter.ai/api/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": prompt}]
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

scenes = result["choices"][0]["message"]["content"]

place_name = selected_file.replace(".txt", "")

output_file = os.path.join(scene_folder, f"{place_name}_scenes.txt")

with open(output_file, "w", encoding="utf-8") as f:
    f.write(scenes)

print(f"\n✅ Scenes generated for {place_name}")