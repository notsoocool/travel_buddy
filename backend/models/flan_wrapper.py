import os
from dotenv import load_dotenv
from openai import OpenAI
import traceback

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_TOKEN")
DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-V3:novita"

# Only generic fallback for LLM tasks
FALLBACK_GENERIC = "Sorry, I couldn't process your request. Please try again later."

def ask_model(prompt: str) -> str:
    if not HF_TOKEN:
        print("Warning: HF_TOKEN not found. Using fallback response.")
        return FALLBACK_GENERIC
    try:
        client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=HF_TOKEN,
        )
        completion = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"DeepSeek API error: {e}")
        traceback.print_exc()
        return FALLBACK_GENERIC
