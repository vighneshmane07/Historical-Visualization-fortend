#import os
#import wikipedia

# Set Wikipedia language
#wikipedia.set_lang("en")

#def get_wikipedia_text(topic):
 #   try:
  #      page = wikipedia.page(topic, auto_suggest=False)
   #     return page.content
   # except wikipedia.DisambiguationError as e:
  #      print("\n❌ Topic is ambiguous. Please be more specific.")
  #      print("Possible options:", e.options[:5])
  #      return None
   # except wikipedia.PageError:
  #      print("\n❌ No Wikipedia page found for this topic.")
     #   return None
   # except Exception as e:
    #    print("\n❌ Error:", e)
    #    return None


#def save_text_to_file(topic, text):
 #   os.makedirs("data/texts", exist_ok=True)

  #  filename = topic.replace(" ", "_") + ".txt"
  #  filepath = os.path.join("data/texts", filename)

  #  with open(filepath, "w", encoding="utf-8") as f:
   #     f.write(text)

   # print(f"\n✅ Data saved successfully in: {filepath}")


# -------- MAIN PROGRAM --------
#print("\n🏛️ Historical Data Collector (Wikipedia)")
#print("Examples: Hampi, Red Fort, Konark Sun Temple, Golconda Fort\n")

#topic = input("Enter the temple / fort / historical place name: ").strip()

#if topic:
 #   text = get_wikipedia_text(topic)
#
  #  if text:
 #       save_text_to_file(topic, text)

   #     print("\n--- First 500 characters ---\n")
 #else:
#    print("❌ No input provided.")

import os
import requests
from bs4 import BeautifulSoup

# ---------------- CONFIG ----------------
API_KEY ="AIzaSyCYv9xhh-bp0UZGomD3WGr9ljf7wfIHXMM"
CX = "63e348ac67ab4418d"
# ----------------------------------------


def google_search(query, num_results=5):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": API_KEY,
        "cx": CX,
        "q": query,
        "num": num_results
    }

    response = requests.get(url, params=params)
    data = response.json()

    results = []
    if "items" in data:
        for item in data["items"]:
            results.append({
                "title": item["title"],
                "link": item["link"],
                "snippet": item["snippet"]
            })
    return results


def extract_page_text(url):
    try:
        r = requests.get(url, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")

        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()

        text = " ".join(soup.stripped_strings)
        return text[:5000]  # limit text
    except:
        return ""


def save_text(topic, text):
    os.makedirs("data/texts", exist_ok=True)
    filename = topic.replace(" ", "_") + ".txt"
    path = os.path.join("data/texts", filename)

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"\n✅ Data saved: {path}")


# ---------------- MAIN ----------------
print("\n🏛️ Historical Data Collector (Google Search)")
topic = input("Enter temple / fort / historical place: ").strip()

query = f"{topic} history temple fort site:gov.in OR site:org"

results = google_search(query)

if not results:
    print("❌ No results found")
    exit()

final_text = ""

for r in results:
    final_text += f"\n\n### {r['title']}\n"
    final_text += r["snippet"] + "\n"

    page_text = extract_page_text(r["link"])
    final_text += page_text

save_text(topic, final_text)

print("\n--- Preview ---\n")
print(final_text[:500])