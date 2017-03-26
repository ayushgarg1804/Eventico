# -*- coding: utf-8 -*-
# @Author: Ayush Garg
# @Date:   2017-03-18 02:13:43
# @Last Modified by:   Aman Priyadarshi
# @Last Modified time: 2017-03-26 13:07:26

import os
import re
from hashlib import md5
from . import database as DB

def do_login(form):
	status = { 'success' : True }
	try:
		username = re.escape(form['user'])
		password = md5(form['pass']).hexdigest()
		uid = DB.get_user(username, password)
		status['uid'] = uid
		status['username'] = username
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

		if re.match("^[a-zA-Z0-9_.-]+$", username) is None:
			raise ValueError('Invalid Username')

		if DB.user_exist(username, email):
			raise ValueError('User already exist')

		if re.match("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email) is None:
			raise ValueError('Invalid Email ID')

		if pass1 != pass2:
			raise ValueError('Password does not match')

		username = re.escape(username)
		password = md5(pass1).hexdigest()
		DB.add_user(username, password, email)
	except Exception as e:
		status['error'] = str(e)
		status['success'] = False
	return status

def do_logout():
	# maybe we want to do some more stuff here?
	status = { 'success' : True }
	return status
