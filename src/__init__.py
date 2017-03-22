# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-20 20:09:41
# @Last Modified by:   Aman Priyadarshi
# @Last Modified time: 2017-03-22 10:22:34

from flask import Flask, render_template, request, session

app = Flask(__name__)
from util import assets, login_register as LR

@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')

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
	return render_template('login-register.html', status=status)

@app.route('/logout')
def logout():
	status = None
	if 'logged' in session:
		status = LR.do_logout()
		if status['success'] == True:
			session.pop('logged', None)
	return render_template('index.html', status=status)

@app.errorhandler(404)
def not_found(e):
	return render_template('error-404.html'), 404