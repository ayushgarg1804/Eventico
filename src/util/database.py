# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-21 10:05:17
# @Last Modified by:   amaneureka
# @Last Modified time: 2017-03-30 22:23:29

import os
import glob
import json
import random
import string
import re
import sqlite3 as sql
from hashlib import md5
from datetime import datetime

database = 'src/database/eventico.db'
connection = None

def sql_init():
	if not os.path.isfile(database):
		global connection
		create_tables()
		create_event_database()
		create_fake_database()
		connection.close()
		# we can't create sqlite instance in main thread
		connection = None

def sql_connect():
	global connection
	if connection == None:
		connection = sql.connect(database)
		connection.isolation_level = None
	return connection

def create_tables():
	connection = sql_connect()
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
	connection = sql_connect()
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
				print ('.'),
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
					pass

				category = (
								get_json_val(data_event, ['category', 'id']),
								get_json_val(data_event, ['category', 'name']),
								get_json_val(data_event, ['category', 'short_name']),
							)
				try:
					cursor.execute('INSERT INTO categories VALUES (?,?,?)', category)
				except:
					pass

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
					pass

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
					pass
		print "event database created"

	connection.commit()

def id_gen(size = 6, chars = string.letters + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))

def get_user(username, password):
	connection = sql_connect()
	cursor = connection.cursor()
	t = (username, password, )
	cursor.execute('SELECT uid FROM users WHERE username=? AND password=?', t)
	row = cursor.fetchone()
	if row is None:
		raise ValueError("Invalid Credentials")
	return row[0]

def user_exist(username, email):
	if username is "" or email is "":
		return True
	connection = sql_connect()
	cursor = connection.cursor()
	t = (username, email, )
	cursor.execute('SELECT uid FROM users WHERE username=? OR email=?', t)
	return cursor.fetchone() is not None

def add_user(username, password, email):
	connection = sql_connect()
	cursor = connection.cursor()
	t = (username, password, email, )
	cursor.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', t)
	connection.commit()

def query_event_by_id(event_id):
	connection = sql_connect()
	cursor = connection.cursor()

	t = (event_id, )
	row = cursor.execute('SELECT * FROM Events WHERE id=?', t).fetchone()
	if row is None:
		return None
	t = (row[11], )
	row2 = cursor.execute('SELECT * FROM venues WHERE id=?', t).fetchone()
	t = (row[13], )
	row3 = cursor.execute('SELECT * FROM Organizers WHERE id=?', t).fetchone()
	row = row + row2 + row3
	return row

def query_event(name, limit = 20):
	connection = sql_connect()
	cursor = connection.cursor()

	name = '%' + re.escape(name) + '%'

	t = (name, limit, )
	row = cursor.execute('SELECT * FROM Events WHERE name like ? ORDER BY start_utc ASC LIMIT ?', t)
	return row.fetchall()

def create_fake_database(num_users = 100, num_reviews= 10):
	connection = sql_connect()
	cursor = connection.cursor()
	cursor.execute('SELECT count(*) from users')
	res = cursor.fetchone()[0]
	if res == 0:
		for i in range(num_users):
			username = ""
			email = ""
			while user_exist(username, email):
				while(re.match("^[a-zA-Z0-9_.-]+$", username) is None):
					username = id_gen(size = random.randint(6,20))
				while (re.match("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email) is None):
					email = id_gen(size = random.randint(6,20)) + "@gmail.com"
			print ('.'),
			passw = id_gen(random.randint(6,20), string.letters + string.digits + string.punctuation)
			passw = md5(passw).hexdigest()
			add_user(username, passw, email)
		print "users table data inserted"
	connection.commit()

	cursor.execute('SELECT count(*) FROM reviews')
	res = cursor.fetchone()[0]
	if res == 0:
		cursor.execute('SELECT id FROM events')
		event_ids = cursor.fetchall()
		cursor.execute('SELECT uid FROM users')
		user_ids = cursor.fetchall()
		for user in user_ids:
			if user[0] is None:
				continue
			for i in range(random.randint(0,num_reviews)):
				comment = id_gen(random.randint(20,100), string.letters + " .!")
				stars = random.randint(0,5)
				timestamp = datetime(2017, random.randint(1,3), random.randint(1,28), random.randint(00, 23), random.randint(00,59))
				eid = random.sample(event_ids, 1)
				eid = eid[0][0]
				review = (eid, user[0], stars, comment, timestamp,)
				cursor.execute('INSERT INTO reviews (eid, uid, stars, comment, posted_time) VALUES (?,?,?,?,?)',
								review);
				print ('.'),
		print "review table data inserted"
	connection.commit()