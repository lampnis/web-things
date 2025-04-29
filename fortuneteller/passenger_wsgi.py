# import imp
# import os
# import sys


# sys.path.insert(0, os.path.dirname(__file__))

# wsgi = imp.load_source('wsgi', 'fortuneteller/wsgi.py')
# application = wsgi.application()

import os
import sys

sys.path.insert(0, "/home/lapinslv/public_html/lapins.lv/adams/home/fortuneteller")
os.environ['DJANGO_SETTINGS_MODULE'] = 'fortuneteller.settings'

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
