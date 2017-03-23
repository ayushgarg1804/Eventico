# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-21 10:05:17
# @Last Modified by:   Ayush Garg
# @Last Modified time: 2017-03-24 01:07:39

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
		# create_event_database()
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
	# unicode to sqlite supported format conversion required
	global connection
	cursor = connection.cursor()
	cursor.execute('SELECT count(*) FROM events')
	res = cursor.fetchone()[0]
	if res==0:
		path = 'src/database/json'
		for jsonfilename in glob.glob(os.path.join(path, '*.json')):
			# print jsonfilename
			jsonfile = open(jsonfilename, 'r')
			data = json.load(jsonfile)
			jsonfile.close()
			for eventnumber in range(data['pagination']['page_size']):
				# print eventnumber
				event = (
							int(data['events'][eventnumber]['id']), 
							data['events'][eventnumber]['name']['html'],
							data['events'][eventnumber]['created'],
							data['events'][eventnumber]['status'],
							data['events'][eventnumber]['id'],
							data['events'][eventnumber]['start']['local'],
							data['events'][eventnumber]['start']['utc'],
							data['events'][eventnumber]['end']['local'],
							data['events'][eventnumber]['end']['utc'],
							data['events'][eventnumber]['description']['html'],
							data['events'][eventnumber]['category']['id'],
							data['events'][eventnumber]['logo']['url'],
							data['events'][eventnumber]['venue']['id'],
							data['events'][eventnumber]['category']['id'],
							data['events'][eventnumber]['online_event'],
							data['events'][eventnumber]['organizer']['id'],
						)
				try:
					cursor.execute('INSERT INTO events VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', event)
				except:
					print "Error in event"

				category = (
								data['events'][eventnumber]['category']['id'],
								data['events'][eventnumber]['category']['name'],
								data['events'][eventnumber]['category']['short_name'],
							)
				try:
					cursor.execute('INSERT INTO categories VALUES (?,?,?)', category)
				except:
					print "Error in category"

				organizer = (
								data['events'][eventnumber]['organizer']['id'],
								data['events'][eventnumber]['organizer']['description']['html'],
								data['events'][eventnumber]['organizer']['url'],
								data['events'][eventnumber]['organizer']['name'],
								data['events'][eventnumber]['organizer']['logo']['url'],
								data['events'][eventnumber]['organizer']['long_description']['html'],
							)

				try:
					cursor.execute('INSERT INTO organizers VALUES (?,?,?,?,?,?)', organizer)
				except:
					print "Error in organizer"

				venue = (
							data['events'][eventnumber]['venue']['id'],
							data['events'][eventnumber]['venue']['name'],
							data['events'][eventnumber]['venue']['longitude'],
							data['events'][eventnumber]['venue']['latitude'],
							data['events'][eventnumber]['venue']['address']['city'],
							data['events'][eventnumber]['venue']['address']['country'],
							data['events'][eventnumber]['venue']['address']['localized_address_display'],
						)

				try:
					cursor.execute('INSERT INTO venues VALUES (?,?,?,?,?,?,?)', venue)
				except:
					print "Error in venue"

	connection.commit()

def create_fake_database():
	pass