import requests
import os
import json

API_KEY ="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"

# Ask user what type of place
place_type = input("What do you want information about? (Temple / Fort / Historical Place): ")

# Ask the name
place_name = input(f"Enter the name of the {place_type}: ")

prompt = f"""
Give detailed historical information about the {place_type} named {place_name} in India.
Include:
1. History
2. Who built it
3. Year of construction
4. Important facts
"""

url = "https://openrouter.ai/api/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "openai/gpt-4o-mini",
    "messages": [
        {"role": "user", "content": prompt}
    ]
}

response = requests.post(url, headers=headers, json=data)

result = response.json()

# DEBUG: Print response
print(json.dumps(result, indent=2))

# Check if response is valid
if "choices" in result:

    text = result["choices"][0]["message"]["content"]

    print("\n🏛️ Historical Information:\n")
    print(text)

    # Create folder
    os.makedirs("data/texts", exist_ok=True)

    # Safe filename
    safe_name = place_name.replace(" ", "_").lower()
    filename = f"data/texts/{safe_name}.txt"

    # Save file
    with open(filename, "w", encoding="utf-8") as file:
        file.write(text)

    print(f"\n✅ Data saved in: {filename}")

else:
    print("\n❌ API Error:")
    print(result)