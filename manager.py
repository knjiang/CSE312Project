from collections import defaultdict

class LobbyManager:
    def __init__(self):
        self.emails = {}
        self.drawer = None
        self.chat = []
        self.answer = 'dog'
    
    def add(self,name,email):
        self.emails[email] = name
    
    def get_name(self,email):
        return self.emails[email]

    def members(self):
        return list(self.emails.keys())
    
    def delete(self,email):
        del self.emails[email]

    def newDrawer(self):
        
        self.drawer = list(self.emails.keys())[0]
        
        return self.drawer

    def nextDrawer(self):
        index = list(self.emails.keys()).index(self.drawer)
        if index + 1 == len(list(self.emails.keys())):
            index = 0
        else:
            index += 1
        
        self.drawer = list(self.emails.keys())[index]

        return self.drawer

    def addChat(self, msg):
        self.chat.append(msg)
        return self.chat

    def retrieveChat(self):
        return self.chat
    
    def isAnswer(self, email, word):
        if word == self.answer:
            return True

class RoomManager(LobbyManager):
    def __init__(self):
        super().__init__()
        self.points = defaultdict(int)

    def add_point(self,email):
        self.points[email] += 1 