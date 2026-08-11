import json
import os
from typing import Any

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
CONNECTORS_FILE = os.path.join(DATA_DIR, "connectors.json")
KNOWLEDGE_FILE = os.path.join(DATA_DIR, "knowledge.json")


def ensure_data_dir() -> None:
    """Ensures that the backend data directory exists."""
    os.makedirs(DATA_DIR, exist_ok=True)


def load_json_store(file_path: str, default_baseline: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Loads stored JSON records from disk; if file is missing, creates it with default baseline."""
    ensure_data_dir()
    if not os.path.exists(file_path):
        save_json_store(file_path, default_baseline)
        return default_baseline
    try:
        with open(file_path, encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return data
    except Exception:
        pass
    return default_baseline


def save_json_store(file_path: str, data: list[dict[str, Any]]) -> None:
    """Atomically persists JSON records to disk."""
    ensure_data_dir()
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[ERROR] Failed to persist data to {file_path}: {e}")
