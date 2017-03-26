# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-20 20:23:39
# @Last Modified by:   Aman Priyadarshi
# @Last Modified time: 2017-03-26 13:01:52

from src.util import database
database.sql_init()

from src import app
app.run(debug=True)
