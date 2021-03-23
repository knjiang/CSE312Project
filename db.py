import sqlite3

def connect():
    conn = sqlite3.connect('demo.db')
    return conn


def addUser(name, email, id):
    conn = connect()
    cur = conn.cursor()
    
    input = ("INSERT INTO demoDB (names, email, id) VALUES (?,?,?)", (name,email,id))

    cur.execute(input)
    conn.commit()

    conn.close()


def getAllUsers():
    conn = connect()
    cur = conn.cursor()

    input = ("SELECT * FROM demoDB")

    cur.execute(input)
    rs = cur.fetchone()

    return rs


def updateUser(name, email, id):
    conn = connect()
    cur = conn.cursor()

    input = ("UPDATE demoDB SET names = ?, email = ? WHERE id = ?", (name, email, id))

    cur.execute(input)
    conn.commit()

    conn.close()

    