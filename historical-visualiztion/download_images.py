import os
import wikipedia
import requests

# SETTINGS
TOPIC = "Shivneri Fort"
IMAGE_DIR = "data/images"

os.makedirs(IMAGE_DIR, exist_ok=True)
wikipedia.set_lang("en")

def get_images(topic):
    page = wikipedia.page(topic)
    images = [
        img for img in page.images
        if img.lower().endswith((".jpg", ".jpeg", ".png"))
    ]
    return images

def show_images(images):
    print("\nAvailable images:\n")
    for i, img in enumerate(images, start=1):
        print(f"{i}. {img}")

def download_selected(images, selections):
    for i in selections:
        index = i - 1
        if 0 <= index < len(images):
            url = images[index]
            try:
                response = requests.get(url, timeout=15)
                if response.status_code == 200:
                    filename = f"{TOPIC.replace(' ', '_')}_{i}.jpg"
                    path = os.path.join(IMAGE_DIR, filename)
                    with open(path, "wb") as f:
                        f.write(response.content)
                    print(f"Downloaded: {path}")
            except Exception as e:
                print("Error:", e)

# -------- MAIN --------
images = get_images(TOPIC)

if not images:
    print("No images found.")
    exit()

show_images(images)

choice = input(
    "\nEnter image numbers to download (example: 1,3,5): "
)

selected_numbers = [
    int(x.strip()) for x in choice.split(",") if x.strip().isdigit()
]

download_selected(images, selected_numbers)

print("\nDone.")