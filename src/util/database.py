# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-21 10:05:17
# @Last Modified by:   Ayush Garg
# @Last Modified time: 2017-03-22 19:40:49

import sqlite3 as sql
import os
import glob
import json

database = 'src/database/eventico.db'
connection = None

def sql_connect():
	global connection
	if connection == None:
		connection = sql.connect(database)
		connection.isolation_level = None
		create_tables()
	return connection

def create_tables():
	global connection
	cursor = connection.cursor()
	path = 'src/schema'
	for scriptfilename in glob.glob(os.path.join(path, '*.sql')):
		scriptFile = open(scriptfilename, 'r')
		script = scriptFile.read()
		scriptFile.close()
		cursor.executescript(script)
	connection.commit()

def create_event_database():
	global connection
	cursor = connection.cursor()
	cursor.execute('SELECT * FROM events')
	if cursor.fetchone() is None:
		events = []
		organizers = []
		venues = []
		categories = []
		path = 'src/database/json'
		for jsonfilename in glob.glob(os.path.join(path, '*.json')):
			jsonfile = open(jsonfilename, 'r')
			data = json.load(jsonfile)
			jsonfile.close()
			for eventnumber in range(data['pagination']['page_size']):
				#TODO

def create_fake_database():
	pass