# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-20 20:09:41
# @Last Modified by:   amaneureka
# @Last Modified time: 2017-03-30 14:15:39

import os
import json
from util import database
from flask import Flask, render_template, request, session, redirect, url_for

app = Flask(__name__)
from util import assets, filters, login_register as LR, database as DB

@app.route('/')
@app.route('/index')
def index():
	events = DB.query_event("");
	return render_template('index.html', events=events)

@app.route('/register', methods=['POST', 'GET'])
def register():
	if 'logged' in session:
		return redirect(url_for('index'))
	status = None
	if request.method == 'POST':
		status = LR.do_register(request.form)
		status['submit'] = 'register'
	return render_template('login-register.html', status=status)

@app.route('/login', methods=['POST', 'GET'])
def login():
	if 'logged' in session:
		return redirect(url_for('index'))
	status = None
	if request.method == 'POST':
		status = LR.do_login(request.form)
		status['submit'] = 'login'
		if status['success'] == True:
			session['logged'] = True
			session['uid'] = status['uid']
			session['username'] = status['username']
	return render_template('login-register.html', status=status)

@app.route('/events', methods=['GET', 'POST'])
def events():
	if request.method == 'POST':
		name = request.form['event_name']
		status = {
			'success' : True,
			'data' : DB.query_event(name),
			'query' : request.form
		}
		return json.dumps(status)
	return render_template('events.html')

@app.route('/logout')
def logout():
	status = None
	if 'logged' in session:
		status = LR.do_logout()
		if status['success'] == True:
			session.pop('uid', None)
			session.pop('logged', None)
			session.pop('username', None)
	return render_template('index.html', status=status)

@app.errorhandler(404)
def not_found(e):
	return render_template('error-404.html'), 404

@app.context_processor
def inject_session():
    return dict(session=session)

app.secret_key = os.urandom(12)
database.sql_init()
