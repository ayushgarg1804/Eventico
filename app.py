# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-26 16:13:42
# @Last Modified by:   Aman Priyadarshi
# @Last Modified time: 2017-03-26 17:12:09

import os

from src.util import database
database.sql_init()

from src import app
app.secret_key = os.urandom(12)
app.run(port=80,debug=True)