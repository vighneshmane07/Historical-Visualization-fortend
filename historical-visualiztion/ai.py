import speech_recognition as sr
import pyttsx3
import datetime
import wikipedia
import pywhatkit
import webbrowser
import requests
import os

API_KEY ="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"

def load_history(question=""):
    history_text = ""
    raigad_text = ""

    try:
        with open("history.txt", "r", encoding="utf-8") as f:
            history_text = f.read()
    except Exception:
        print("history.txt not found")

    if "raigad" in question.lower():
        try:
            with open("raigad_data.txt", "r", encoding="utf-8") as f:
                raigad_text = f.read()
        except Exception:
            print("raigad_data.txt not found")

    if raigad_text:
        return history_text + "\n" + raigad_text
    return history_text


def speak(text):
    text = str(text)
    print("Assistant:", text)

    engine = pyttsx3.init()
    engine.setProperty("rate", 170)
    engine.say(text)
    engine.runAndWait()


def take_command():
    listener = sr.Recognizer()

    with sr.Microphone() as source:
        print("Listening...")
        listener.pause_threshold = 1
        audio = listener.listen(source)

    try:
        print("Recognizing...")
        command = listener.recognize_google(audio)
        command = command.lower()
        print("You said:", command)
    except Exception:
        print("Say that again...")
        return "none"

    return command


def ai_brain(question):
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "Jarvis Assistant"
    }

    history_context = load_history(question)

    final_prompt = f"""
You are an AI historical storyteller.

Answer the user's question clearly and accurately.
Use the provided historical data only if it is relevant to the user's question.
Do not force connections to Raigad Fort or any other place unless the user explicitly asks about it.

Historical Data:
{history_context}

User Question:
{question}
"""

    data = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "user", "content": final_prompt}
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        result = response.json()

        if "choices" in result:
            answer = result["choices"][0]["message"]["content"]
            return answer
        else:
            print("API Error:", result)
            return "Sorry boss, AI brain error."

    except Exception as e:
        print("AI Error:", e)
        return "Sorry boss, I cannot connect to the AI brain."


def start_voice_assistant():
    speak("Hello boss, how can I help you")

    while True:
        command = take_command()

        if command == "none":
            continue

        if "time" in command:
            time = datetime.datetime.now().strftime("%I:%M %p")
            speak("The time is " + time)

        elif "who is" in command:
            person = command.replace("who is", "")
            try:
                info = wikipedia.summary(person, 1)
                speak(info)
            except Exception:
                speak("Sorry boss, I could not find information.")

        elif "play" in command:
            song = command.replace("play", "")
            speak("Playing " + song)
            pywhatkit.playonyt(song)

        elif "open google" in command:
            speak("Opening Google")
            webbrowser.open("https://google.com")

        elif "stop" in command or "exit" in command:
            speak("Goodbye boss")
            break

        else:
            answer = ai_brain(command)
            print("AI:", answer)
            speak(answer)


if __name__ == "__main__":
    start_voice_assistant()