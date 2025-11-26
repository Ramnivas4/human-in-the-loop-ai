from livekit.agents.voice import Agent
import inspect

sig = inspect.signature(Agent.__init__)
with open("signature.txt", "w") as f:
    f.write(str(sig))
