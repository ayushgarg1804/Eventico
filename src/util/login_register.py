# -*- coding: utf-8 -*-
# @Author: Ayush Garg
# @Date:   2017-03-18 02:13:43
# @Last Modified by:   Ayush Garg
# @Last Modified time: 2017-03-18 19:51:24

from flask import Flask, session, redirect, url_for, escape, request, render_template
from hashlib import md5
import sqlite3 as sql
import os

# Change in site html required!
app = Flask(__name__)

if __name__ == '__main__':
    db = sql.connect("test.db")
    cur = db.cursor()
    app.secret_key = os.urandom(12)

class ServerError(Exception):pass

@app.route('/')
def index():
    if 'username' not in session:
        return redirect(url_for('login'))

    username_session = escape(session['username']).capitalize()
    return render_template('index.html', session_user_name=username_session)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'username' in session:
        return redirect(url_for('index'))

    error = None
    try:
        if request.method == 'POST':
            # <input type="submit" name="submit_B" value="Login button">
            if request.form['submit_B'] == 'Login button':
                username_form  = request.form['username']
                cur.execute("SELECT COUNT(1) FROM users WHERE name = {};"
                            .format(username_form))

                if not cur.fetchone()[0]:
                    raise ServerError('Invalid username')

                password_form  = request.form['password']
                cur.execute("SELECT pass FROM users WHERE name = {};"
                            .format(username_form))

                for row in cur.fetchall():
                    if md5(password_form).hexdigest() == row[0]:
                        session['username'] = request.form['username']
                        return redirect(url_for('index'))

                raise ServerError('Invalid password')

            elif request.form['submit_B'] == 'Register button':
                username_form = request.form['username_R']
                cur.execute("SELECT COUNT(1) FROM users WHERE name = {};"
                            .format(username_form))

                if cur.fetchone()[0]:
                    raise ServerError('Username not available')

                email_form = request.form['email']

                password_form  = request.form['password_R']
                password_form_retype = request.form['password_R_retype']
                if password_form != password_form_retype:
                    raise ServerError('Passwords dont match')

                user_new = (username_form, md5(password_form).hexdigest(), email_form)
                cur.execute("INSERT INTO users VALUES (?,?,?)", user_new)
                # return redirect(url_for('email_sent'))

    except ServerError as e:
        error = str(e)

    return render_template('login.html', error=error)


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)