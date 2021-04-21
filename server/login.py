from authlib.integrations.flask_client import OAuth
import os
from app import *

client = MongoClient('mongo')
db = client['email-database']
light_collection = db['light_mode']

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
    package = {'logged_in' : False, 'user_name' : 'Guest'}
    if 'user' in session:
        if light_collection.find_one({'user_email': session['user']['email']}):
            db_user = light_collection.find_one({'user_email': session['user']['email']})
            package['logged_in'] = db_user['logged_in']
            package['user_name'] = db_user['user_name']
            package['user_email'] = db_user['user_email']
            package['background'] = db_user['background']
            package['light'] = db_user['light']
            package['background_color'] = db_user['background_color']
            package['text_color'] = db_user['text_color']
        else:
            package['logged_in'] = True
            package['user_name'] = session['user']['given_name']
            package['user_email'] = session['user']['email']
            package['background'] = 'light'
            package['light'] = True
            package['background_color'] = '#FFF'
            package['text_color'] = '#363537'
    return package

