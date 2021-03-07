from authlib.integrations.flask_client import OAuth
import os
from app import *

app.config.from_object('config')
app.secret_key = os.urandom(24)

CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
oauth = OAuth(app)
oauth.register(
    name='google',
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@app.route('/api/login')
def login():
    redirect_uri = url_for('auth', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@app.route('/api/auth')
def auth():
    token = oauth.google.authorize_access_token()
    user = oauth.google.parse_id_token(token)
    session['user'] = user
    return redirect('/api/')


@app.route('/api/logout')
def logout():
    session.pop('user', None)
    return redirect('/api/')

@app.route('/api/verify_login')
def is_logged():
    package = {'logged_in' : False}
    if 'user' in session:
        package['logged_in'] = True
    return package
