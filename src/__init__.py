# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-20 20:09:41
# @Last Modified by:   amaneureka
# @Last Modified time: 2017-04-08 22:55:07

import os
import json
from util import database
from flask import Flask, render_template, request, session, redirect, url_for

app = Flask(__name__)
from util import assets, filters, login_register as LR, database as DB

@app.route('/')
@app.route('/index')
def index():
	events = DB.query_event("",asc =False);
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
	r_url = 'index'
	if request.method == 'POST':
		print request.query_string
		status = LR.do_login(request.form)
		status['submit'] = 'login'
		if status['success'] == True:
			session['logged'] = True
			session['uid'] = status['uid']
			session['username'] = status['username']
	try:
		r_url = request.args.get('redirect_url')
	except:
		pass
	return render_template('login-register.html', status=status, redirect_url=r_url)

@app.route('/events', methods=['GET', 'POST'])
@app.route('/events/<int:event_id>', methods=['GET', 'POST'])
def events(event_id = None):
	if event_id is not None:
		if request.method == 'POST':
			status = {
				'success' : False
			}
			if 'logged' in session:
				uid = session['uid']
				rate = request.form['rating']
				message = request.form['message']
				DB.insert_new_review(event_id, uid, rate, message)
				status['success'] = True
			return json.dumps(status)
		event_detail = DB.query_event_by_id(event_id)
		if event_detail is None:
			return render_template('error-404.html'), 404
		recentevents = DB.query_event("", 3);
		eurl = url_for('events', event_id=event_id)
		return render_template('event-detail.html', upcomingevents=recentevents, event=event_detail, event_url=eurl)

	if request.method == 'POST':
		name = request.form['event_name']
		status = {
			'success' : True,
			'data' : DB.query_event(name),
			'query' : request.form
		}
		return json.dumps(status)
	return render_template('events.html')

@app.route('/events/add', methods=['GET', 'POST'])
@app.route('/events/edit/<int:event_id>', methods=['GET', 'POST'])
def event_edit(event_id = None):
	if request.method == 'POST':
		status = {
			'success' : False
		}
		if 'logged' in session:
			uid = session['uid']
			form = request.form
			# do black magic here
			# query database, check permissions
			# check if we are creating new event or editing old one
			# by verifying event_id value, == None if new post
			# return status
		return json.dumps(status)
	recentevents = DB.query_event("", 3);
	event_detail = DB.query_event_by_id(event_id)
	return render_template('event-edit.html', upcomingevents=recentevents, event=event_detail)

@app.route('/logout')
def logout():
	status = None
	if 'logged' in session:
		status = LR.do_logout()
		if status['success'] == True:
			session.pop('uid', None)
			session.pop('logged', None)
			session.pop('username', None)
	return redirect(url_for('index'))

@app.errorhandler(404)
def not_found(e):
	return render_template('error-404.html'), 404

@app.context_processor
def inject_session():
    return dict(session=session)

app.secret_key = os.urandom(12)
database.sql_init()
