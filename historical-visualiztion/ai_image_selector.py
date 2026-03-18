import os
import wikipedia
import requests
import time

# ---------------- USER INPUT ----------------
TOPIC = input("Enter historical place / fort / temple name: ").strip()

if not TOPIC:
    print("No topic entered.")
    exit()

# ---------------- SETTINGS ----------------
IMAGE_DIR = "data/images"
REQUIRED_IMAGES = 5
MIN_SIZE = 70_000  # bytes

os.makedirs(IMAGE_DIR, exist_ok=True)
wikipedia.set_lang("en")

HEADERS = {
    "User-Agent": "HistoricalVisualizationAI/1.0 (Educational)"
}

REJECT_WORDS = [
    "logo", "icon", "map", "plan", "symbol",
    "flag", "emblem", "portrait", "painting"
]

print("\n=== BALANCED AI IMAGE SELECTOR ===")
print("Topic:", TOPIC)

# ---------------- LOAD PAGE ----------------
try:
    page = wikipedia.page(TOPIC, auto_suggest=True)
except Exception as e:
    print("Wikipedia error:", e)
    exit()

images = page.images
print("Total images found:", len(images))

downloaded = 0
checked = 0

for url in images:
    if downloaded >= REQUIRED_IMAGES:
        break

    checked += 1
    filename = os.path.basename(url).lower()

    # ---- FORMAT FILTER ----
    if not filename.endswith((".jpg", ".jpeg", ".png")):
        continue

    # ---- REJECT OBVIOUS BAD TYPES ----
    if any(word in filename for word in REJECT_WORDS):
        continue

    print(f"\nEvaluating image {checked}")
    print("URL:", url)

    try:
        response = requests.get(url, headers=HEADERS, timeout=20)

        # ---- QUALITY HEURISTIC (AI DECISION) ----
        if response.status_code == 200 and len(response.content) >= MIN_SIZE:
            save_name = f"{TOPIC.replace(' ', '_')}_AI_{downloaded+1}.jpg"
            path = os.path.join(IMAGE_DIR, save_name)

            with open(path, "wb") as f:
                f.write(response.content)

            downloaded += 1
            print("✔ Accepted & downloaded")
        else:
            print("✖ Rejected (low quality / thumbnail)")

        time.sleep(2)

    except Exception as e:
        print("✖ Download failed:", e)

# ---------------- SUMMARY ----------------
print("\n=== AI SUMMARY ===")
print("Images checked:", checked)
print("Images downloaded:", downloaded)
