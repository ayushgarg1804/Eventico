# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-21 10:05:17
# @Last Modified by:   Ayush Garg
# @Last Modified time: 2017-03-24 19:20:17

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
		create_event_database()
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

def get_json_val(data, attri):
	if not attri:
		return data
	if data[attri[0]] is None:
		return None
	return get_json_val(data[attri[0]], attri[1:])


def create_event_database():
	# unicode to sqlite supported format conversion not required
	global connection
	cursor = connection.cursor()
	cursor.execute('SELECT count(*) FROM events')
	res = cursor.fetchone()[0]
	if res==0:
		path = 'src/database/json'
		for jsonfilename in glob.glob(os.path.join(path, '*.json')):
			print jsonfilename # can be used for logging 
			jsonfile = open(jsonfilename, 'r')
			data = json.load(jsonfile)
			jsonfile.close()
			data = get_json_val(data, ['events'])
			for eventnumber in range(len(data)):
				print eventnumber # can be used for logging
				data_event = get_json_val(data, [eventnumber])
				if data_event is None:
					continue
				event = (
							get_json_val(data_event, ['id']), 
							get_json_val(data_event, ['name', 'html']),
							get_json_val(data_event, ['created']),
							get_json_val(data_event, ['status']),
							get_json_val(data_event, ['start', 'local']),
							get_json_val(data_event, ['start', 'utc']),
							get_json_val(data_event, ['end', 'local']),
							get_json_val(data_event, ['end', 'utc']),
							get_json_val(data_event, ['description', 'html']),
							get_json_val(data_event, ['category', 'id']),
							get_json_val(data_event, ['logo', 'url']),
							get_json_val(data_event, ['venue', 'id']),
							get_json_val(data_event, ['online_event']),
							get_json_val(data_event, ['organizer', 'id']),
						)

				try:
					cursor.execute('INSERT INTO events VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', event)
				except:
					print "Error in event"
				category = (
								get_json_val(data_event, ['category', 'id']),
								get_json_val(data_event, ['category', 'name']),
								get_json_val(data_event, ['category', 'short_name']),
							)
				try:
					cursor.execute('INSERT INTO categories VALUES (?,?,?)', category)
				except:
					print "Error in category"
				organizer = (
								get_json_val(data_event, ['organizer', 'id']),
								get_json_val(data_event, ['organizer', 'description', 'html']),
								get_json_val(data_event, ['organizer', 'url']),
								get_json_val(data_event, ['organizer', 'name']),
								get_json_val(data_event, ['organizer', 'logo', 'url']),
								get_json_val(data_event, ['organizer', 'long_description', 'html']),
							)

				try:
					cursor.execute('INSERT INTO organizers VALUES (?,?,?,?,?,?)', organizer)
				except:
					print "Error in organizer"
				venue = (
							get_json_val(data_event, ['venue', 'id']),
							get_json_val(data_event, ['venue', 'name']),
							get_json_val(data_event, ['venue', 'longitude']),
							get_json_val(data_event, ['venue', 'latitude']),
							get_json_val(data_event, ['venue', 'address', 'city']),
							get_json_val(data_event, ['venue', 'address', 'country']),
							get_json_val(data_event, ['venue', 'address', 'localized_address_display']),
						)

				try:
					cursor.execute('INSERT INTO venues VALUES (?,?,?,?,?,?,?)', venue)
				except:
					print "Error in venue"

	connection.commit()

def create_fake_database():
	pass