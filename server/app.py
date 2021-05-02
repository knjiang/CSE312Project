from flask import Flask, url_for, session, redirect
from flask import render_template, redirect, request
from authlib.integrations.flask_client import OAuth
from flask_socketio import SocketIO, emit
from time import sleep
from bson.json_util import dumps
from bson.json_util import loads
app = Flask(__name__)
socketIo = SocketIO(app, cors_allowed_origins = '*')

import login
from manager import LobbyManager, RoomManager
from mongo import db, usersCol, gameInfoCol, wordListCol, dmCol, imageCol

lobby_manager = LobbyManager()
room_manager = RoomManager()

light_collection = db['light_mode']


@app.route('/api/')
def homepage():
    return redirect("http://localhost:3000")

@socketIo.on('logged')
def handleLogin(info):
    if info['logged_in']:
        if info['add']:
            lobby_manager.add(info['user_name'], info['user_email'])
        elif info['add'] == False:
            lobby_manager.delete(info['user_email'])
        emit('logged',lobby_manager.members(3),broadcast=True)
    return None 


@socketIo.on('emit_canvas')
def sendDrawing(data):
    emit("receive_canvas", data, broadcast = True)

#change, email
@socketIo.on('gameStatus')
def game(data):
    if data[0] == "disconnectGame":
        lobby_manager.updateStatus(data[0], data[1]) #ok
        if len(lobby_manager.members(2)) < 2:
            lobby_manager.endGame() #ok
            emit('receiveChat', lobby_manager.updateChat('System', 'Not enough players, game stopped'), broadcast = True) #ok
            emit('endGame', None, broadcast = True) #ok
    elif data[0] == "connectGame":
        lobby_manager.updateStatus(data[0], data[1])

    #get points in format [email, points]
    p = lobby_manager.getPoints() #ok
    drawer = gameInfoCol.find()[0]["drawer"] #ok
    word = gameInfoCol.find()[0]["word"] #ok
    emit('gameUsers', [lobby_manager.members(2), drawer, word, p], broadcast = True)

@socketIo.on('getMembers')
def stat(data):
    emit("getMembers", lobby_manager.members(data), broadcast = False)

@socketIo.on('updateDM')
def udm(data):
    #email from, email to, message
    res = []
    if (data[0] != None and data[1] != None):
        #adding dms
        res = lobby_manager.updateDM(data[0], data[1], data[2])
        if len(res) > 0:
            emit('upgradeDM', None, broadcast = True)
            emit('allDM', res, broadcast = False)
    else:
        #only extracting
        res = lobby_manager.updateDM(data[0], None, None)
        if len(res) > 0:
            emit('allDM', res, broadcast = False)

@socketIo.on('deleteNotification')
def delnotif(data):
    # data stores email from a to b
    # delete notif from b to a
    lobby_manager.deleteNotification(data[0],data[1])

@socketIo.on('updateNotification')
def udnotif(data):
    #email from, email to
    if notifCol.find_one({"participants":[data[0],data[1]]}).count() > 0:
        continue
    elif notifCol.find_one({"participants":[data[0],data[1]]}).count() == 0:
        lobby_manager.updateNotification(data[0],data[1])

    # res = []
    # if (data[0] != None and data[1] != None):
    #     #adding dms
    #     res = lobby_manager.updateDM(data[0], data[1], data[2])
    #     if len(res) > 0:
    #         emit('upgradeDM', None, broadcast = True)
    #         emit('allDM', res, broadcast = False)
    # else:
    #     #only extracting
    #     res = lobby_manager.updateDM(data[0], None, None)
    #     if len(res) > 0:
    #         emit('allDM', res, broadcast = False)


#For starting game and next round
@socketIo.on('newDrawer') 
def nextD(nothing):
    if (lobby_manager.winner == False and len(lobby_manager.members(2)) > 1):
        lobby_manager.winner = True
        sec = 5
        lobby_manager.newRound()
        for i in range(5, 0, -1):
            emit ('receiveChat', lobby_manager.updateChat('System', 'The next game will start in {}'.format(sec)), broadcast = True)
            sec -= 1
            sleep(1)
        lobby_manager.winner = False
        emit('newDrawer', lobby_manager.newDrawer(), broadcast = True)
        emit('receiveChat', lobby_manager.updateChat(None, None), broadcast = True)
        gRound = gameInfoCol.find()[0]["round"]
        nGame = True
        time = 30
        while gRound == gameInfoCol.find()[0]["round"] and time > -1:
            if time == -1:
                nGame = True
                break
            if gRound != gameInfoCol.find()[0]["round"]:
                nGame = False
                break
            sleep(1)
            emit('timerLeft', time, broadcast = True)
            #emit('receiveChat', lobby_manager.updateChat('System', "timer going newDrawer," + str(gRound) + ", " + str(lobby_manager.gameStatus["round"])), broadcast = True)
            time -= 1
        if nGame and gRound == gameInfoCol.find()[0]["round"]:
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
        player = usersCol.find({"email": data[0]})
        stat = ''
        for n in player:
            stat = n["status"]
        if lobby_manager.correct(data[0], data[1]) and (data[0] != gameInfoCol.find()[0]["drawer"]) and (stat == 2) and lobby_manager.winner == False and len(lobby_manager.members(2)) > 1:
            usersCol.update({"email": data[0]}, {
                "$inc": {
                    "points": 1
                }
            })

            lobby_manager.winner = True
            lobby_manager.newRound()
            emit('receiveChat', lobby_manager.updateChat('System', data[0] + ' has found the answer of "' + gameInfoCol.find()[0]["word"] + '"!'), broadcast = True)
            for i in range(5, 0, -1):
                emit ('receiveChat', lobby_manager.updateChat('System', 'The next game will start in {}'.format(sec)), broadcast = True)
                sec -= 1
                sleep(1)
            emit('newDrawer', lobby_manager.newDrawer(), broadcast = True)
            emit('receiveChat', lobby_manager.updateChat(None, None), broadcast = True)
            gRound = gameInfoCol.find()[0]["round"]
            nGame = True
            time = 30
            lobby_manager.winner = False
            while gRound == gameInfoCol.find()[0]["round"] and time > -1:
                if time == -1:
                    nGame = True
                    break
                if gRound != gameInfoCol.find()[0]["round"]:
                    nGame = False
                    break
                sleep(1)
                emit('timerLeft', time, broadcast = True)
                #emit('receiveChat', lobby_manager.updateChat('System', "timer going lobbyChat," + str(gRound) + ", " + str(lobby_manager.gameStatus["round"])), broadcast = True)
                time -= 1
            if nGame and gRound == gameInfoCol.find()[0]["round"]:
                emit ('receiveChat', lobby_manager.updateChat('System', "Timer's up!"), broadcast = True)
                emit('timerUp', None, broadcast = True)
        else:
            emit('receiveChat', lobby_manager.updateChat(data[0], data[1]), broadcast = True)
    else:
        emit('receiveChat', lobby_manager.updateChat(None, None), broadcast = True)

@socketIo.on('saveImage')
def save(data):
    email = data[1]
    img = data[0]
    if imageCol.find({"email": email}).count() > 0:
        imageCol.update({"email": email}, {
            "$push": {"images": img
                        }
        })
    else:
        image_data = {"email": email, "images": [img]}
        imageCol.insert_one(image_data)

@socketIo.on('getImage')
def get(data):
    images = []
    if data:
        res = imageCol.find({"email": data})
        for m in res:
            for i in m["images"]:
                images.append(i)
        lobby_manager.tester += 1
        emit("displayImage", images, broadcast = False)

@app.route('/api/online_users')
def is_online():
    package = { 'members' : lobby_manager.members(3) }
    return package 

@app.route('/api/session')
def is_session():
    package = {'mybers' : session}
    return package 

@app.route('/api/online_room')
def is_on():
    package = {'memebers' : room_manager.members(2)}
    return package 

@app.route('/api/light_mode',methods=['POST'])
def light_mode():
    data = request.json
    if light_collection.find_one({'user_email': data['user_email']}):
        light_collection.remove({'user_email': data['user_email']})
    light_collection.insert_one(data)
    return 'OK' 


#for testing
@app.route('/api/data')
def u_info():
    p = []
    cursor = usersCol.find()
    if cursor:
        for m in cursor:
            try:
                p.append([m["email"], "Status: " + str(m["status"])])
            except:
                p.append("EXCEPTED but WORKS")
    package = {"Users": p, "tester": lobby_manager.tester}
    return package

if __name__ == "__main__":
    socketIo.run(app)