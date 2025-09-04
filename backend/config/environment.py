import os

SETTINGS_MODULE = "config.settings.local"

if os.environ.get("ENVIRONMENT") == "dev":
    SETTINGS_MODULE = "config.settings.dev"

if os.environ.get("ENVIRONMENT") == "prod":
    SETTINGS_MODULE = "config.settings.prod"
