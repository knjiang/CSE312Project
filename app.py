from flask import Flask, url_for, session
from flask import render_template, redirect
from authlib.integrations.flask_client import OAuth


app = Flask(__name__)

import login 

@app.route('/api/')
def homepage():
    user = session.get('user')
    return render_template('home.html', user=user)

