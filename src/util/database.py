# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-21 10:05:17
# @Last Modified by:   Ayush Garg
# @Last Modified time: 2017-04-09 21:45:04

import os
import re
import glob
import json
import random
import string
import time
import sqlite3 as sql
import progressbar
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

def add_user(username, password, email, user_level = 0):
	connection = sql_connect()
	cursor = connection.cursor()
	t = (username, password, email, user_level)
	cursor.execute('INSERT INTO users (username, password, email, user_level) VALUES (?, ?, ?, ?)', t)
	connection.commit()

def insert_new_review(eid, uid, rating, comment):
	connection = sql_connect()
	cursor = connection.cursor()

	t = (eid, uid, rating, comment, time.strftime('%Y-%m-%d %H:%M:%S'), )
	cursor.execute('INSERT INTO reviews (eid, uid, stars, comment, posted_time) VALUES (?,?,?,?,?)', t);
	connection.commit()

def query_reviews(eid):
	if eid is None:
		return None
	connection  = sql_connect()
	cursor = connection.cursor()

	t = (eid, )
	row = cursor.execute('SELECT * FROM reviews WHERE eid = ? ORDER BY stars DESC LIMIT 10', t).fetchall()
	if row is None:
		return None
	for i in range(len(row)):
		t = (row[i][2], )
		username = cursor.execute('SELECT username FROM users WHERE uid = ?', t).fetchone()
		row[i] = row[i] + username
	return row

def query_event_by_id(event_id):
	if event_id == None:
		return None

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

	t = (event_id, )
	row4 = cursor.execute('SELECT AVG(stars), count(cid) FROM Reviews WHERE eid=?', t).fetchone()

	t = (row[9], )
	row5 = cursor.execute('SELECT * FROM Categories WHERE id=?', t).fetchone()

	row = row + row2 + row3 + row4 + row5
	return row

def query_event(name, limit = 20, asc = True):
	connection = sql_connect()
	cursor = connection.cursor()

	# name = '%' + re.escape(name) + '%'
	# spaces gets replaced by // due to which no match is found
	name = '%' + name + '%'
	if(asc == False):
		t = (name, unicode(monthdelta(datetime.now(), 1)), limit, )
		row = cursor.execute('SELECT *,avg(stars) FROM Events, Reviews WHERE eid = id AND'
				' name like ? AND start_utc < ? GROUP BY eid ORDER BY start_utc DESC LIMIT ?', t)
	else:
		t = (name, limit, )
		row = cursor.execute('SELECT *,avg(stars) FROM Events, Reviews WHERE eid = id AND'
				' name like ? GROUP BY eid ORDER BY start_utc  ASC LIMIT ?', t)
	return row.fetchall()

def check_user_level(uid):
	connection = sql_connect()
	cursor = connection.cursor()
	t = (uid, )
	cursor.execute('SELECT user_level FROM users WHERE uid = ?', t)
	row = cursor.fetchone()
	if row[0] > 1:
		return True
	return False

def last_event_created():
	connection = sql_connect()
	cursor = connection.cursor()
	cursor.execute('SELECT * FROM Events ORDER BY created DESC LIMIT 1')
	row = cursor.fetchone()
	return row

def highest_rating():
	connection = sql_connect()
	cursor = connection.cursor()
	t = (unicode(datetime.now()), )
	cursor.execute('SELECT events.id, events.name, events.start_utc FROM Events, reviews '
					' WHERE events.id = eid AND start_utc > ? GROUP BY eid ORDER BY avg(stars) DESC LIMIT 1', t)
	row = cursor.fetchone()
	return row

def update_event(data, event_id):
	connection = sql_connect()
	cursor = connection.cursor()

	t = (data['category'], )
	try:
		cursor.execute('INSERT INTO categories (name) VALUES (?)', t)
	except:
		# who cares
		pass
	cursor.execute('SELECT id FROM categories WHERE name = ?', t)
	category_id = cursor.fetchone()[0]

	t = (uid, data['author'])
	try:
		cursor.execute('INSERT INTO organizers (id, name) VALUES (?, ?)', t)
	except:
		# who cares
		pass
	organizer_id = uid

	t = (data['place'], data['city'], )
	try:
		cursor.execute('INSERT INTO venues (name, city) VALUES (?, ?)', t)
	except:
		# who cares
		pass
	cursor.execute('SELECT id FROM venues WHERE name = ? AND city = ?', t)
	venue_id = cursor.fetchone()[0]

	t = (data['title'], data['start_utc'], data['end_utc'], data['desc'],
		 category_id, organizer_id, venue_id, "LIVE", event_id)
	cursor.execute('UPDATE events  SET (name = ?, start_utc = ?, end_utc = ?, description = ?, category_id = ?, ' +
					'organizer_id = ?, venue_id = ?, status = ?) WHERE id = ?', t)
	cursor.execute('SELECT count(*) FROM events WHERE name = ? AND start_utc = ? AND end_utc = ? AND description = ? AND category_id = ? AND ' +
					'organizer_id = ? AND venue_id = ? AND status = ? AND id = ?', t)
	res = cursor.fetchone()[0]
	connection.commit()
	if res == 0:
		return False
	return True

def insert_event(data, uid):
	connection = sql_connect()
	cursor = connection.cursor()

	t = (data['category'], )
	try:
		cursor.execute('INSERT INTO categories (name) VALUES (?)', t)
	except:
		# who cares
		pass
	cursor.execute('SELECT id FROM categories WHERE name = ?', t)
	category_id = cursor.fetchone()[0]

	t = (uid, data['author'])
	try:
		cursor.execute('INSERT INTO organizers (id, name) VALUES (?, ?)', t)
	except:
		# who cares
		pass
	organizer_id = uid

	t = (data['place'], data['city'], )
	try:
		cursor.execute('INSERT INTO venues (name, city) VALUES (?, ?)', t)
	except:
		# who cares
		pass
	cursor.execute('SELECT id FROM venues WHERE name = ? AND city = ?', t)
	venue_id = cursor.fetchone()[0]

	t = (data['title'], data['start_utc'], data['end_utc'], data['desc'],
		 category_id, organizer_id, venue_id, "LIVE", unicode(datetime.now()))
	cursor.execute('INSERT INTO events (name, start_utc, end_utc, description, category_id, ' +
					'organizer_id, venue_id, status, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', t)
	cursor.execute('SELECT id FROM events WHERE name = ? AND start_utc = ? AND end_utc = ? AND description = ? AND category_id = ? AND ' +
					'organizer_id = ? AND venue_id = ? AND status = ? AND created = ?', t)
	event_id = cursor.fetchone()[0]
	connection.commit()
	return event_id

def monthdelta(date, delta):
	m, y = (date.month+delta) % 12, date.year + ((date.month)+delta-1) // 12
	if not m: m = 12
	d = min(date.day, [31,29 if y%4==0 and not y%400==0 else 28,31,30,31,30,31,31,30,31,30,31][m-1])
	return date.replace(day=d,month=m, year=y)

def id_gen(size = 6, chars = string.letters + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))

def create_event_database():
	# unicode to sqlite supported format conversion not required
	connection = sql_connect()
	cursor = connection.cursor()
	cursor.execute('SELECT count(*) FROM events')
	res = cursor.fetchone()[0]
	if res==0:
		path = 'src/database/json'
		for jsonfilename in glob.glob(os.path.join(path, '*.json')):
			print "\n" + jsonfilename + "\n" # can be used for logging
			jsonfile = open(jsonfilename, 'r')
			data = json.load(jsonfile)
			jsonfile.close()
			data = get_json_val(data, ['events'])
			bar = progressbar.ProgressBar(maxval = len(data))
			bar.start()
			for eventnumber in range(len(data)):
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
				bar.update(eventnumber+1)
			bar.finish()
		print "\nevent database created\n"
	connection.commit()

def create_fake_database(num_users = 100, num_reviews= 30):
	connection = sql_connect()
	cursor = connection.cursor()
	cursor.execute('SELECT count(*) from users')
	res = cursor.fetchone()[0]
	if res == 0:
		add_user("admin", "132a9eef94c7ab110e7b1ab19e8eee75", "ayushgarg1804@gmail.com", 3)
		print "\nUsers table data \n"
		bar = progressbar.ProgressBar(maxval = num_users)
		bar.start()
		for i in range(num_users):
			username = ""
			email = ""
			while user_exist(username, email):
				while(re.match("^[a-zA-Z0-9_.-]+$", username) is None):
					username = id_gen(size = random.randint(6,20))
				while (re.match("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email) is None):
					email = id_gen(size = random.randint(6,20)) + "@gmail.com"
			passw = id_gen(random.randint(6,20), string.letters + string.digits + string.punctuation)
			passw = md5(passw).hexdigest()
			add_user(username, passw, email)
			bar.update(i+1)
		bar.finish()
	connection.commit()

	cursor.execute('SELECT count(*) FROM reviews')
	res = cursor.fetchone()[0]
	if res == 0:
		cursor.execute('SELECT id FROM events')
		event_ids = cursor.fetchall()
		cursor.execute('SELECT uid FROM users')
		user_ids = cursor.fetchall()
		print "\nReview table data\n"
		bar = progressbar.ProgressBar(maxval = len(user_ids))
		bar.start()
		x = 0
		for user in user_ids:
			x += 1
			if user[0] is None:
				continue
			review_count = random.randint(0, num_reviews)
			for i in range(review_count):
				comment = id_gen(random.randint(20,100), string.letters + " .!")
				stars = random.randint(1,5)
				timestamp = datetime(2017, random.randint(1,3), random.randint(1,28), random.randint(00, 23), random.randint(00,59))
				eid = random.sample(event_ids, 1)
				eid = eid[0][0]
				review = (eid, user[0], stars, comment, timestamp,)
				cursor.execute('INSERT INTO reviews (eid, uid, stars, comment, posted_time) VALUES (?,?,?,?,?)',
								review);
			bar.update(x)
		bar.finish()
		print("")
	connection.commit()