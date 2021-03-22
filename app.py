from flask import Flask, url_for, session, redirect
from flask import render_template, redirect
from authlib.integrations.flask_client import OAuth


app = Flask(__name__)

import login 

@app.route('/api/')
def homepage():
    return redirect("http://localhost:3000")

