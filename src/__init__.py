# -*- coding: utf-8 -*-
# @Author: Aman Priyadarshi
# @Date:   2017-03-20 20:09:41
# @Last Modified by:   Aman Priyadarshi
# @Last Modified time: 2017-03-21 01:01:46

from flask import Flask, render_template

app = Flask(__name__)
from util import assets

@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')

@app.route('/login')
@app.route('/register')
def login():
	return render_template('login-register.html')

@app.errorhandler(404)
def not_found(e):
	return render_template('error-404.html'), 404