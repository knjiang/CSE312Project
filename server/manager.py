from collections import defaultdict
import random
from mongo import db, usersCol, gameInfoCol, wordListCol, dmCol

class LobbyManager:
    def __init__(self):

        words = {"words": ['cat', 'dog', 'bed', 'socks', 'trumpet', 'car', 'phone']}
        wordListCol.insert_one(words)

        gameData = {"status": False, "gameChat": [], "drawer": None, "word": None, "prevChat": None, "round": 0, "prevWords": [], "gameChat": []}
        gameInfoCol.insert_one(gameData)

        #self.wordList = ['cat', 'dog', 'bed', 'socks', 'trumpet', 'car', 'phone'] # MONGOED
        #self.users = {} # MONGOED {email: {status: 1, name: "", profile: "", points: 0, dm: {}}}, status is 0 = logged out, 1 = loggin in, and 2 = in game
        #self.gameStatus = {"status": False, "gameChat": [], "drawer": None, "word": None, "prevChat": None, "round": 0} # MONGOED {status: False, drawer: "", word: "", prevWords: [], gameChat: []}}
        #self.dm = {}
        self.winner = False
        self.tester = 0
        '''
        {"user": "312baron@gmail.com",
        "interacted": ["huangbaron2@mgial.com, etc, etc],
        "messages": {"huangbaron2@gmail.com": [["312baron@gmail.com", "hi"], ["huangbaron2@gmail.com", "bye"], ["huangbaron2@gmail.com", "cool"]],
            "baronhua@buffalo.edu": [["baronhua@buffalo.edu", "yo"], ["baronhua@buffalo.edu", "wassup"], ["312baron@gmail.com", "my bad"]],
            "testemail.com": [["baronhua@buffalo.edu", "yo"], ["baronhua@buffalo.edu", "wassup"], ["312baron@gmail.com", "my bad"]],
            "testemail2.com": [["baronhua@buffalo.edu", "yo"], ["baronhua@buffalo.edu", "wassup"], ["312baron@gmail.com", "my bad"]]}
            } 
        '''

    def add(self,name,email):
        data = {"email": email, "status": 1, "name": name, "profile": [], "points": 0}
        result = usersCol.find({"email": email}).count()
        if result == 0:
            usersCol.insert_one(data)
        else:
            usersCol.update({"email": email}, {
                "$set": {"status" : 1}
            })
    
    def get_name(self,email):
        result = usersCol.find_one({"email": email})
        return result["name"]

    def members(self, status):
        gameUsers = []
        if status < 3:
            result = usersCol.find({"status": status})
            for n in result:
                gameUsers.append(n["email"])
        elif status == 3:
            result_2 = usersCol.find({"status": 2})
            if result_2:
                for n in result_2:
                    gameUsers.append(n["email"])
            result_1 = usersCol.find({"status": 1})
            if result_1:
                for n in result_1:
                    gameUsers.append(n["email"])
        elif status == 4:
            result_2 = usersCol.find({"status": 2})
            if result_2:
                for n in result_2:
                    gameUsers.append(n["email"])
            result_1 = usersCol.find({"status": 1})
            if result_1:
                for n in result_1:
                    gameUsers.append(n["email"])
            result_0 = usersCol.find({"status": 0})
            if result_0:
                for n in result_0:
                    gameUsers.append(n["email"])
            
        return gameUsers
    
    def delete(self,email):
        usersCol.update({"email": email}, {
            "$set": {
            "status": 0}
        })

    def updateStatus(self, change, email):
        #"connectGame" for connect, "disconnectGame" for disconnect
        if change == "connectGame":
            usersCol.update({"email": email}, {
                "$set": {
                        "status": 2,
                        "points": 0}
            })
        else:
            usersCol.update({"email": email}, {
                "$set": {
                        "status": 1,
                        "points": 0}
            })

    def endGame(self):
        gameInfoCol.update({}, {
            "$set": {
                "status": False,
                "drawer": None,
                "word": None,
                "round": 0
            }
        })
        usersCol.update({}, {
                "$set": {
                "points": 0}
        })

    def newRound(self):
        gameInfoCol.update({}, {
            "$inc": {
                "round": 1
            }
        })

    def newDrawer(self):
        greater_than = usersCol.find({"status": 2}).count()
        if greater_than > 1:
            inGame = []

            result_2 = usersCol.find({"status": 2})
            for u in result_2:
                inGame.append(u["email"])
            resultGameAll = gameInfoCol.find()
            drawer = resultGameAll[0]["drawer"]
            if drawer != None: #New drawer from running game
                index = inGame.index(drawer)
                if index + 1 == len(inGame):
                    index = 0
                else:
                    index += 1
                newDrawer = inGame[index]
                drawer = newDrawer
                gameInfoCol.update({}, {
                    "$set": {
                        "drawer": newDrawer
                    }
                })

            else: #New drawer from new game
                gameInfoCol.update({}, {
                    "$set": {
                        "drawer": inGame[0],
                        "status": True,
                    }
                })
                drawer = gameInfoCol.find()[0]["drawer"]

            prevWordsList = []
            if len(resultGameAll[0]["prevWords"]) == 3:
                newPrev = (resultGameAll[0]["prevWords"][:2]).copy()
                gameInfoCol.update({}, {
                    "$set": {
                        "prevWords": newPrev
                    }
                })
                prevWordsList = newPrev

            result = wordListCol.find()
            n = result[0]["words"]
            r = random.randint(0, len(n) - 1)
            while n[r] in prevWordsList:
                r = random.randint(0, len(n) - 1)
            word = n[r]

            prevWordsList.append(word)
            gameInfoCol.update({}, {
                "$set": {
                    "prevWords": prevWordsList,
                    "word": word
                },
                "$push": {
                    "gameChat": {
                        "$each": [['System', 'New game is starting'], ['System', drawer + 'is the new drawer!']]
                        }
                }
            })

            return [drawer, word]

    def updateChat(self, email, msg):
        if msg:
            gameInfoCol.update({}, {
                "$push": {
                    "gameChat": [email, msg]
                }
            })

        msg = gameInfoCol.find()[0]["gameChat"]
        if len(msg) > 100:
            msg = msg.copy()[5:]
        return msg
    
    def deleteNotification(self,fr,to):
        notif = notifCol.find_one({"participants": [to,fr]})
        if notif.count() > 0:
            notifCol.deleteOne(notif)


    def updateNotification(self, fr, to):
        if (fr and to):
            notificationExists = notifCol.find_one({"participants": [fr, to]})
            newNotification = {"participants": [fr,to]}
            if notificationExists.count() == 0:
                notifCol.insert_one(newNotification)

    def updateDM(self, fr, to, dm):
        #if adding message to database
        if (fr and to):
            #new schema to check out:
            #{"participants": ["A", "B"]
            # "messages": [
            #               {"user": "A", "message": "Wassup"}, {"user": "B", "message": "the sky"}
            #             ]}
            #to extract, find() every {"from": user} and {"to": user}
            emailFromExists = dmCol.find_one({"participants": {"$all": [fr, to]}})
            newDM = {"user": fr, "message": dm}
            fullDM = {"participants": [fr, to], "messages": [{"user": fr, "message": dm}]}
            if emailFromExists:
                dmCol.update({"participants": {"$all": [fr, to]}}, {
                    "$push": {
                        "messages": newDM
                    }
                })
            else:
                dmCol.insert_one(fullDM)

        #extracting for one user
        res_from = dmCol.find({"participants": {"$all": [fr]}}) 
        res = []
        lan = {}
        for n in res_from:
            receiver = ''
            if n["participants"][0] != fr:
                receiver = n["participants"][0]
            else:
                receiver = n["participants"][1]
            lan[receiver] = []

            for i in n["messages"]:
                lan[receiver].append([i["user"], i["message"]])
        res.append(lan)
        
        return res
        #for user_0 (fr), going to return: [{"user_1": [["user_0", "hi"], ["user_1", "bye"]]}, {"user_5": [["user_0", "hi"], ["user_5", "bye"]]}]

    def correct(self, email, word):
        wordDB = gameInfoCol.find()[0]["word"]
        drawerDB = gameInfoCol.find()[0]["drawer"]
        if word == wordDB and email != drawerDB:
            return True
        else:
            return False


    def getPoints(self):
        result = usersCol.find({"status": 2})
        po = []
        for m in result:
            po.append([m["email"], m["points"]])
        return po

class RoomManager(LobbyManager):
    def __init__(self):
        super().__init__()
        self.points = defaultdict(int)

    def add_point(self,email):
        self.points[email] += 1 


    '''
    self.emails = {} #email, name   everyone logged in
    self.inGame = {} #email, score  everyone in game
    self.drawer = None #Signals if game is on or off
    self.chat = []
    self.prevWords = []
    self.word = None
    '''