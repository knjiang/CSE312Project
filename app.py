from flask import Flask, url_for, session, redirect
from flask import render_template, redirect
from authlib.integrations.flask_client import OAuth
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
socketIo = SocketIO(app, cors_allowed_origins="*")

import login
from manager import LobbyManager

lobby_manager = LobbyManager()
CORS(app)
app.host = 'localhost'

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

@socketIo.on("canvas-data")
def emitDrawing(data):
    emit('canvas-data', data, broadcast=True)
    return data

temporary_chat = []

@socketIo.on("lobby-chat")
def emitChat(data):
    temp = data
    if len(temp.replace(" ", "")) != 0:
        temporary_chat.append([data])
    emit('lobby-chat', temporary_chat, broadcast = True)
    return None
    

if __name__ == "__main__":
    socketIo.run(app)