import os
import sys

# Adjust this path
sys.path.insert(0, "/home/lapinslv/public_html/lapins.lv/adams/home/fortuneteller")

os.environ['DJANGO_SETTINGS_MODULE'] = 'fortuneteller.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()