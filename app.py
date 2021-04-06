from flask import Flask, url_for, session, redirect
from flask import render_template, redirect
from authlib.integrations.flask_client import OAuth
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketIo = SocketIO(app, cors_allowed_origins = '*')

import login
from manager import LobbyManager, RoomManager

lobby_manager = LobbyManager()
room_manager = RoomManager()

@app.route('/api/')
def homepage():
    return redirect("http://localhost:3000")

@socketIo.on('logged')
def handleLogin(info):
    if info['logged_in']:
        if info['add'] and info['user_email'] not in lobby_manager.emails:
            lobby_manager.add(info['user_name'],info['user_email'])
        elif info['add'] == False:
            lobby_manager.delete(info['user_email'])
        emit('logged',lobby_manager.members(),broadcast=True)
    return None 

@socketIo.on('emit_canvas')
def sendDrawing(data):
    emit("receive_canvas", data, broadcast = True)

@socketIo.on('emitPlayer') 
def joined(data):
    emit('newGame', lobby_manager.newDrawer(), broadcast = True)
    emit('receivePlayer', [lobby_manager.members(), data], broadcast = True)

@socketIo.on('nextDrawer') 
def nextD(data):
    emit('newDrawer', lobby_manager.nextDrawer(), broadcast = True)

@socketIo.on('lobbyChat') 
def nextD(data):
    #data is {email: chat}
    if data:
        emit('receiveChat', lobby_manager.addChat(data), broadcast = True)
        if lobby_manager.isAnswer(data[0], data[1]):
            emit('newDrawer', lobby_manager.nextDrawer(), broadcast = True)
            emit('receiveChat', lobby_manager.addChat(['System', data[0] + ' has found the answer of "' +  lobby_manager.answer + '"!']), broadcast = True)
            emit('answerFound', data[0], broadcast = True)
    else:
        emit('receiveChat', lobby_manager.retrieveChat(), broadcast = True)

@app.route('/api/online_users')
def is_online():
    package = { 'members' : lobby_manager.members() }
    return package 

@app.route('/api/session')
def is_session():
    package = {'mybers' : session}
    return package 

@app.route('/api/online_room')
def is_on():
    package = {'memebers' : room_manager.members()}
    return package 

if __name__ == "__main__":
    socketIo.run(app)