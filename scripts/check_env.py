from dotenv import load_dotenv
import os

load_dotenv(".env.local")
load_dotenv()

keys = ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET", "OPENAI_API_KEY", "DEEPGRAM_API_KEY"]
for key in keys:
    val = os.getenv(key)
    if val:
        print(f"{key}: Present (Length: {len(val)})")
    else:
        print(f"{key}: MISSING")
