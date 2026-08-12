import importlib
import os

import pytest


def _reload_config_with_env(monkeypatch: pytest.MonkeyPatch, **env: str):
    for key, value in env.items():
        monkeypatch.setenv(key, value)
    import app.core.config as config_module
    importlib.reload(config_module)
    return config_module


def test_production_with_demo_secret_key_raises(monkeypatch: pytest.MonkeyPatch) -> None:
    with pytest.raises(RuntimeError, match="SECRET_KEY"):
        _reload_config_with_env(
            monkeypatch,
            APP_ENV="production",
            SECRET_KEY="demo-secret-key-troque-em-producao",
            DATABASE_URL="sqlite+aiosqlite:///./gamestar.db",
        )


def test_production_with_real_secret_key_succeeds(monkeypatch: pytest.MonkeyPatch) -> None:
    config_module = _reload_config_with_env(
        monkeypatch,
        APP_ENV="production",
        SECRET_KEY="a-real-64-char-random-secret-generated-with-secrets-token-hex",
        DATABASE_URL="sqlite+aiosqlite:///./gamestar.db",
    )
    assert config_module.settings.app_env == "production"
