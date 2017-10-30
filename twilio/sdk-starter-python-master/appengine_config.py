
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'gaenv'))

# [START vendor]
from google.appengine.ext import vendor

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'gaenv'))

# Add any libraries installed in the "lib" folder.
vendor.add('env/lib/python2.7/site-packages')
# [END vendor]