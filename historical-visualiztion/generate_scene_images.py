import requests
import os

scene_folder = "data/scenes"
image_folder = "data/images"

os.makedirs(image_folder, exist_ok=True)

files = [f for f in os.listdir(scene_folder) if f.endswith(".txt")]

print("Available scene files:")
for i, f in enumerate(files):
    print(f"{i+1}. {f}")

choice = int(input("Select scene file: "))
scene_file = files[choice-1]

with open(os.path.join(scene_folder, scene_file), "r", encoding="utf-8") as f:
    scenes = f.readlines()

for i, scene in enumerate(scenes):

    prompt = scene.strip().replace(" ", "%20")

    url = f"https://image.pollinations.ai/prompt/{prompt}"

    img = requests.get(url).content

    with open(f"{image_folder}/scene_{i+1}.png", "wb") as f:
        f.write(img)

print("✅ Images generated successfully")
AIzaSyDq6izJwPddeHrqm_t6g7bI5sFRqH77lIo