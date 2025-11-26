import livekit.agents
import pkgutil
import importlib
import inspect

def list_classes(module):
    classes = []
    if hasattr(module, "__path__"):
        for _, name, _ in pkgutil.iter_modules(module.__path__):
            try:
                submodule = importlib.import_module(f"{module.__name__}.{name}")
                for member_name, member in inspect.getmembers(submodule):
                    if inspect.isclass(member) and (member_name.endswith("Agent") or member_name.endswith("Assistant")):
                        classes.append(f"{submodule.__name__}.{member_name}")
            except ImportError:
                continue
    return classes

print("Classes found:")
for cls in list_classes(livekit.agents):
    print(cls)
