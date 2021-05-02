from pymongo import MongoClient 

client = MongoClient('mongo')
db = client['email-database']

usersCol = db['users']
gameInfoCol = db['gameStatus']
wordListCol = db['wordList']
dmCol = db['dm']
imageCol = db['images']
notifCol = db['notifications']