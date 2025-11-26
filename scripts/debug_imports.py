try:
    from livekit import rtc
    print("rtc ok")
    from livekit.agents import JobContext, WorkerOptions, cli, llm
    print("agents ok")
    from livekit.agents.voice_assistant import VoiceAssistant
    print("voice_assistant ok")
    
    import livekit.plugins.openai
    print("openai ok")
    import livekit.plugins.deepgram
    print("deepgram ok")
    import livekit.plugins.silero
    print("silero ok")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"Error: {e}")
