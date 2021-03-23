from collections import defaultdict

class LobbyManager:
    def __init__(self):
        self.emails = {}
    
    def add(self,name,email):
        self.emails[email] = name
    
    def get_name(self,email):
        return self.emails[email]

    def members(self):
        return list(self.emails.keys())
    
    def delete(self,email):
        del self.emails[email]

class RoomManager(LobbyManager):
    def __init__(self):
        super().__init__()
        self.points = defaultdict(int)

    def add_point(self,email):
        self.points[email] += 1 