# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-21 10:05:17
# @Last Modified by:   Ayush Garg
# @Last Modified time: 2017-03-21 22:43:07

import sqlite3 as sql

database = '../database/eventico.db'
connection = None

def sql_connect():
	global connection
	if connection == None:
		connection = sql.connect(database)
		connection.isolation_level = None
