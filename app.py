# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-26 16:13:42
# @Last Modified by:   Ayush Garg
# @Last Modified time: 2017-03-30 01:59:02

import os

from src.util import database
from src import app

app.secret_key = os.urandom(12)

if __name__ == '__main__':
	# database.sql_init()
	app.run(debug=True)