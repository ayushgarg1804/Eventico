# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-21 10:05:17
# @Last Modified by:   Aman Priyadarshi
# @Last Modified time: 2017-03-22 10:22:54

import sqlite3 as sql

database = 'src/database/eventico.db'
connection = None

def sql_connect():
	global connection
	if connection == None:
		connection = sql.connect(database)
		connection.isolation_level = None
	return connection

def create_fake_database():
	pass