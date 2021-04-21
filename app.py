from flask import Flask, url_for, session, redirect
from flask import render_template, redirect, request
from authlib.integrations.flask_client import OAuth
from flask_socketio import SocketIO, emit
from time import sleep;

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
        if info['add'] and info['user_email'] not in lobby_manager.users.keys():
            lobby_manager.add(info['user_name'],info['user_email'])
        elif info['add'] == False:
            lobby_manager.delete(info['user_email'])
        emit('logged',lobby_manager.members(0),broadcast=True)
    return None 

@socketIo.on('emit_canvas')
def sendDrawing(data):
    emit("receive_canvas", data, broadcast = True)

#updates gamestate with 2 for connect and 1 for disconnect
#change, email
@socketIo.on('gameStatus')
def game(data):
    if data[1]:
        lobby_manager.updateStatus(data[0], data[1])

    p = []
    for u in lobby_manager.users.keys():
        p.append([u, lobby_manager.users[u]["points"]])
    emit('gameUsers', [lobby_manager.members(2), lobby_manager.gameStatus["drawer"], lobby_manager.gameStatus["word"], p], broadcast = True)

@socketIo.on('updateDM')
def udm(data):
    #email from, email to, message
    if (data):
        if (data[1]):
            lobby_manager.updateDM(data[0], data[1], data[2])
    emit('allDM', [lobby_manager.dm], broadcast = True)

#For starting game and next round
@socketIo.on('newDrawer') 
def nextD(nothing):
    sec = 5
    lobby_manager.newRound()
    for i in range(5, 0, -1):
        emit ('receiveChat', lobby_manager.updateChat('System', 'The next game will start in {}'.format(sec)), broadcast = True)
        sec -= 1
        sleep(1)
    emit('newDrawer', lobby_manager.newDrawer(), broadcast = True)
    emit('receiveChat', lobby_manager.updateChat(None, None), broadcast = True)
    gRound = lobby_manager.gameStatus["round"]
    nGame = True
    time = 30
    while gRound == lobby_manager.gameStatus["round"] and time > -1:
        if time == -1:
            nGame = True
            break
        if gRound != lobby_manager.gameStatus["round"]:
            nGame = False
            break
        sleep(1)
        emit('timerLeft', time, broadcast = True)
        #emit('receiveChat', lobby_manager.updateChat('System', "timer going newDrawer," + str(gRound) + ", " + str(lobby_manager.gameStatus["round"])), broadcast = True)
        time -= 1
    if nGame and gRound == lobby_manager.gameStatus["round"]:
        emit ('receiveChat', lobby_manager.updateChat('System', "Timer's up!"), broadcast = True)
        emit('timerUp', None, broadcast = True)

#For stopping game
@socketIo.on('stopGame')
def stop(data):
    lobby_manager.endGame()
    emit('receiveChat', lobby_manager.updateChat('System', 'Game stopped'), broadcast = True)
    emit('endGame', None)

@socketIo.on('lobbyChat') 
def nextC(data):
    #data is {email: chat}
    if data:
        sec = 5
        if lobby_manager.correct(data[0], data[1]) and data[0] != lobby_manager.gameStatus["drawer"]:
            lobby_manager.newRound()
            emit('receiveChat', lobby_manager.updateChat('System', data[0] + ' has found the answer of "' +  lobby_manager.gameStatus["word"] + '"!'), broadcast = True)
            for i in range(5, 0, -1):
                emit ('receiveChat', lobby_manager.updateChat('System', 'The next game will start in {}'.format(sec)), broadcast = True)
                sec -= 1
                sleep(1)
            emit('newDrawer', lobby_manager.newDrawer(), broadcast = True)
            emit('receiveChat', lobby_manager.updateChat(None, None), broadcast = True)
            gRound = lobby_manager.gameStatus["round"]
            nGame = True
            time = 30
            while gRound == lobby_manager.gameStatus["round"] and time > -1:
                if time == -1:
                    nGame = True
                    break
                if gRound != lobby_manager.gameStatus["round"]:
                    nGame = False
                    break
                sleep(1)
                emit('timerLeft', time, broadcast = True)
                #emit('receiveChat', lobby_manager.updateChat('System', "timer going lobbyChat," + str(gRound) + ", " + str(lobby_manager.gameStatus["round"])), broadcast = True)
                time -= 1
            if nGame and gRound == lobby_manager.gameStatus["round"]:
                emit ('receiveChat', lobby_manager.updateChat('System', "Timer's up!"), broadcast = True)
                emit('timerUp', None, broadcast = True)
        else:
            emit('receiveChat', lobby_manager.updateChat(data[0], data[1]), broadcast = True)
    else:
        emit('receiveChat', lobby_manager.updateChat(None, None), broadcast = True)

@app.route('/api/online_users')
def is_online():
    package = { 'members' : lobby_manager.members(0) }
    return package 

@app.route('/api/session')
def is_session():
    package = {'mybers' : session}
    return package 

@app.route('/api/online_room')
def is_on():
    package = {'memebers' : room_manager.members(0)}
    return package 

#for testing
@app.route('/api/data')
def u_info():
    package = {"users": lobby_manager.users, "status": lobby_manager.gameStatus, "DMS": lobby_manager.dm}
    return package

if __name__ == "__main__":
    socketIo.run(app)