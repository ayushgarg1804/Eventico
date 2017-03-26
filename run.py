# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-20 20:23:39
# @Last Modified by:   Aman Priyadarshi
# @Last Modified time: 2017-03-26 13:52:36

import os

from src.util import database
database.sql_init()

from src import app
app.secret_key = os.urandom(12)
app.run(debug=True)