import sys
from pathlib import Path


def pytest_configure(config):
    # Ensure backend folder is on sys.path so `import app` works inside tests
    here = Path(__file__).resolve().parent
    backend_root = here.parent
    backend_root_str = str(backend_root)
    if backend_root_str not in sys.path:
        sys.path.insert(0, backend_root_str)
