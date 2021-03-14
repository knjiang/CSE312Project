class LobbyManager:
    def __init__(self):
        self.members = [] 
    
    def add(self,name,email):
        self.members.append((name,email))
        