import livekit.agents
import inspect

print("Searching for VoiceAssistant...")
if hasattr(livekit.agents, "VoiceAssistant"):
    print("Found in livekit.agents")
else:
    print("Not found in livekit.agents")
    # Try submodules
    try:
        from livekit.agents import voice_assistant
        if hasattr(voice_assistant, "VoiceAssistant"):
            print("Found in livekit.agents.voice_assistant")
    except ImportError:
        print("livekit.agents.voice_assistant module not found")

    try:
        from livekit.agents import voice
        if hasattr(voice, "VoiceAssistant"):
            print("Found in livekit.agents.voice")
    except ImportError:
        print("livekit.agents.voice module not found")

print("\nChecking other classes...")
classes = ["JobContext", "WorkerOptions", "cli", "llm", "AutoSubscribe"]
for cls in classes:
    if hasattr(livekit.agents, cls):
        print(f"{cls} found in livekit.agents")
    else:
        print(f"{cls} NOT found in livekit.agents")
