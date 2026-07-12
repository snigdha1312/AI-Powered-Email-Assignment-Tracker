from django.apps import AppConfig


import sys

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Automatically launch automated background jobs only when actively running the dev server
        if 'runserver' in sys.argv:
            from . import updater
            updater.start()
