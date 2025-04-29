import os
import sys


sys.path.insert(0, "/home/lapinslv/public_html/lapins.lv/adams/home/fortuneteller/")
os.environ['DJANGO_SETTINGS_MODULE'] = 'fortuneteller.settings'

wsgi = imp.load_source('wsgi', 'fortuneteller/wsgi.py')
application = wsgi.application
