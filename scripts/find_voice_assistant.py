import livekit.agents
import pkgutil
import importlib
import inspect

def find_class(module, class_name):
    if hasattr(module, class_name):
        return f"{module.__name__}.{class_name}"
    
    if hasattr(module, "__path__"):
        for _, name, _ in pkgutil.iter_modules(module.__path__):
            try:
                submodule = importlib.import_module(f"{module.__name__}.{name}")
                if hasattr(submodule, class_name):
                    return f"{submodule.__name__}.{class_name}"
            except ImportError:
                continue
    return None

print(f"VoiceAssistant: {find_class(livekit.agents, 'VoiceAssistant')}")
print(f"AutoSubscribe: {find_class(livekit.agents, 'AutoSubscribe')}")
