from collections import defaultdict
import random

class LobbyManager:
    def __init__(self):

        self.wordList = ['cat', 'dog', 'bed', 'socks', 'trumpet', 'car', 'phone']
        self.users = {} #{email: {status: 1, name: "", profile: "", points: 0}}, status is 0 = logged out, 1 = loggin in, and 2 = in game
        self.gameStatus = {"status": False, "gameChat": [], "drawer": None, "word": None, "prevChat": None, "round": 0} #{status: False, drawer: "", word: "", prevWords: [], gameChat: []}}

    
    def add(self,name,email):
        #self.emails[email] = name
        self.users[email] = {"status": 1, "name": name, "profile": [], "points": 0}
    
    def get_email(self):
        return list(self.emails.keys())

    def get_name(self,email):
        return self.users[email]["name"]

    def members(self, status):
        #logged in
        if status == 1:
            gameUsers = []
            for email in self.users:
                if self.users[email]["status"] == 1:
                    gameUsers.append(email)
        #in game
        if status == 2:
            gameUsers = []
            for email in self.users:
                if self.users[email]["status"] == 2:
                    gameUsers.append(email)
        #all users
        if status == 0:
            gameUsers = []
            for email in self.users:
                gameUsers.append(email)
        return gameUsers
    
    def delete(self,email):
        del self.users[email]

    def updateStatus(self, change, email):
        #True for connect, False for disconnect
        if change:
            self.users[email]["status"] = 2
            self.users[email]["points"] = 0
        else:
            self.users[email]["status"] = 1
            self.users[email]["points"] = 0

    def endGame(self):
        self.gameStatus["status"] = False
        for email in self.users:
            self.users[email]["points"] = 0

    def newRound(self):
        self.gameStatus["round"] += 1

    def newDrawer(self):
        inGame = []
        for k in self.users:
            if self.users[k]["status"] == 2:
                inGame.append(k)
        if self.gameStatus["drawer"] != None: #New drawer from running game
            index = inGame.index(self.gameStatus["drawer"])
            if index + 1 == len(inGame):
                index = 0
            else:
                index += 1
            self.gameStatus["drawer"] = inGame[index]
        else: #New drawer from new game
            self.gameStatus["drawer"] = list(self.users.copy().keys())[0]
            self.gameStatus["status"] = True
            self.gameStatus["prevWords"] = []
            
        if len(self.gameStatus["prevWords"]) == 3:
            self.gameStatus["prevWords"] = self.gameStatus["prevWords"][2:]

        wordLL = len(self.gameStatus["prevWords"])
        while wordLL == len(self.gameStatus["prevWords"]):
            r = random.randint(0, len(self.wordList) - 1)
            if self.wordList[r] not in self.gameStatus["prevWords"]:
                self.gameStatus["prevWords"].append(self.wordList[r])
                self.gameStatus["word"] = self.wordList[r]


        #delete the append chat below, change nextDrawer to global newDrawer and incorporate the append chat to app.py
        self.gameStatus["gameChat"].append(['System', 'New game is starting'])
        self.gameStatus["gameChat"].append(['System', self.gameStatus["drawer"] + ' is the new drawer!'])

        return [self.gameStatus["drawer"], self.gameStatus["word"]]

    def updateChat(self, email, msg):
        if msg:
            self.gameStatus["gameChat"].append([email, msg])
        if len(self.gameStatus["gameChat"]) > 100:
            self.gameStatus["gameChat"] = self.gameStatus["gameChat"].copy()[:-100]
        return self.gameStatus["gameChat"]
    
    def correct(self, email, word):
        if word == self.gameStatus["word"] and email != self.gameStatus["drawer"]:
            self.users[email]["points"] += 1
            return True

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