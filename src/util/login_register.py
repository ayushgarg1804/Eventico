# -*- coding: utf-8 -*-
# @Author: Ayush Garg
# @Date:   2017-03-18 02:13:43
# @Last Modified by:   Aman Priyadarshi
# @Last Modified time: 2017-03-21 22:22:29

import os
import re
from hashlib import md5
from . import database

def get_user(username, password):
	global connection
	sql_connect()

	cursor = connection.cursor()
	t = (username, password, )
	cursor.execute('SELECT uid FROM users WHERE username=? AND password=?', t)
	row = cursor.fetchone()
	if row is None:
		raise ValueError("Invalid Credentials")
	return row[0]

def user_exist(username, email):
	global connection
	sql_connect()

	cursor = connection.cursor()
	t = (username, email, )
	cursor.execute('SELECT uid FROM users WHERE username=? OR email=?', t)
	return cursor.fetchone() is not None

def add_user(username, password, email):
	global connection
	sql_connect()

	cursor = connection.cursor()
	t = (username, password, email)
	cursor.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', t)

def do_login(form):
	status = { 'success' : True }
	try:
		username = re.escape(form['user'])
		password = md5(form['pass']).hexdigest()
		uid = get_user(username, password)
		status['uid'] = uid
	except Exception as e:
		status['error'] = str(e)
		status['success'] = False
	return status

def do_register(form):
	status = {'success' : True}
	try:
		username = form['user']
		pass1 = form['pass']
		pass2 = form['pass2']
		email = form['email']

		if re.match("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email) is None:
			raise ValueError('Invalid Email ID')

		if re.match("^[a-zA-Z0-9_.-]+$", username) is None:
			raise ValueError('Invalid Username')

		if pass1 != pass2:
			raise ValueError('Password does not match')

		if user_exist(username, email):
			raise ValueError('User already exist')

		username = escape(username)
		password = md5(pass1).hexdigest()
		add_user(username, password, email)
	except Exception as e:
		status['error'] = str(e)
		status['success'] = False
	return status

def do_logout():
	# maybe we want to do some more stuff here?
	status = { 'success' : True }
	return status
