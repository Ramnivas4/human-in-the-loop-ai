import traceback
try:
    print("Checking livekit...")
    import livekit
    print("livekit ok")
    
    print("Checking livekit.agents...")
    import livekit.agents
    print("livekit.agents ok")
    
    print("Checking livekit.plugins.openai...")
    import livekit.plugins.openai
    print("livekit.plugins.openai ok")
    
    print("Checking livekit.plugins.deepgram...")
    import livekit.plugins.deepgram
    print("livekit.plugins.deepgram ok")
    
    print("Checking livekit.plugins.silero...")
    import livekit.plugins.silero
    print("livekit.plugins.silero ok")

except ImportError:
    traceback.print_exc()
except Exception:
    traceback.print_exc()
