# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-26 16:13:42
# @Last Modified by:   amaneureka
# @Last Modified time: 2017-03-28 20:54:28

import os

from src.util import database
database.sql_init()

from src import app
app.secret_key = os.urandom(12)
app.run(debug=True)