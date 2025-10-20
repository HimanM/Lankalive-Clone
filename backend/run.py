import sys
from pathlib import Path

# Add backend directory to sys.path so `import app` works regardless of CWD
ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.app import create_app


def main():
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=True)


if __name__ == '__main__':
    main()
