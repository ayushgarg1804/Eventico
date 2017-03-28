# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-26 16:13:42
# @Last Modified by:   amaneureka
# @Last Modified time: 2017-03-28 22:27:49

import os

from src.util import database
from src import app

app.secret_key = os.urandom(12)

if __name__ == '__main__':
	database.sql_init()
	app.run(debug=True)