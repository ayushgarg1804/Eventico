# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-26 16:13:42
# @Last Modified by:   amaneureka
# @Last Modified time: 2017-04-10 04:09:13

import os

from src.util import database
from src import app

if __name__ == '__main__':
	app.run(host= '0.0.0.0', debug=True)
