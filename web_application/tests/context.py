import os
import sys
appFolder = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
sys.path.insert(0, appFolder)

from production.api import models


