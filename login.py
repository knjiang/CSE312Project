from authlib.integrations.flask_client import OAuth

oauth = OAuth(app)
oauth.init_app(app)
