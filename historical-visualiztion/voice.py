import google.generativeai as genai

genai.configure(api_key="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")

model = genai.GenerativeModel("gemini-pro")

while True:
    user = input("आप: ")

    response = model.generate_content(user)

    print("AI:", response.text)