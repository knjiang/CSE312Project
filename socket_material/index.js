// persist user ID
// when refreshing, a new random userId is generated
// decide on design of private messaging

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const userSocketIdMap = new Map();

io.sockets.on('connection', (socket) => {
    let userName = socket.handshake.query.userName;
    //add client to online users list
    addClientToMap(userName, socket.id);
    console.log(userSocketIdMap)
    console.log(socket.id + " joined")
    socket.on('disconnect', () => {
        //remove this client from online list
        removeClientFromMap(userName, socket.id);
        console.log(userSocketIdMap)
        console.log(socket.id + " disconnected")

    });
    socket.on('chat message', (recipientUserName, messageContent) => {
        //get all clients (socketIds) of recipient
        let recipientSocketIds = userSocketIdMap.get(recipientUserName);
        for (let socketId of recipientSocketIds) {
        io.to(socketID).emit('new message', messageContent);
        }
    });
});

function addClientToMap(userName, socketId){
    if (!userSocketIdMap.has(userName)) {
    //when user is joining first time
    userSocketIdMap.set(userName, new Set([socketId]));
    } else{
    //user had already joined from one client and now joining using another client
    userSocketIdMap.get(userName).add(socketId);
    }
};

function removeClientFromMap(userName, socketId){
    if (userSocketIdMap.has(userName)) {
    let userSocketIdSet = userSocketIdMap.get(userName);
    userSocketIdSet.delete(socketId);
    //if there are no clients for a user, remove that user from online list (map)
    if (userSocketIdSet.size ==0 ) {
    userSocketIdMap.delete(userName);
        }
    }
};



// io.on("connection", (socket) => {
//     const users = [];
//     for (let [id, socket] of io.of("/").sockets) {
//       users.push({
//         userID: id,
//         username: socket.username,
//       });
//     }
//     socket.emit("users", users);
//     // ...
//   });

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
// });

// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       console.log('message: ' + msg);
//     });
//   });

http.listen(3000, () => {
  console.log('listening on *:3000');
});