from flask import Flask, url_for, session, redirect
from flask import render_template, redirect
from authlib.integrations.flask_client import OAuth
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketIo = SocketIO(app, cors_allowed_origins="*")

import login
from manager import LobbyManager

lobby_manager = LobbyManager()

@app.route('/api/')
def homepage():
    return redirect("http://localhost:3000")

@socketIo.on("logged")
def handleLogin(info):
    if info['logged_in']:
        print(info)
        lobby_manager.add(info['user_name'],info['user_email'])
        print(lobby_manager.members)
        emit('logged',lobby_manager.members,broadcast=True)
    return None 
    

if __name__ == "__main__":
    socketIo.run(app)