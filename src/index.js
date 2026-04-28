const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

const MAX_USERS = 100;
const MAX_MESSAGES = 50;
let activeUsers = [];
let messages = [];


// Serve static files (CSS, JS, Images) from the 'public' folder
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

io.on('connection', (socket) => {

    console.log(`A user connected on ${socket}`);

    socket.on('request-history', () => {
        socket.emit('load-history', messages);
    });

    socket.on('set-username', (name) => {

        if (activeUsers.includes(name)) {
            socket.emit('username-error', 'This name is taken. Try another!');
            return;
        } else {
            console.log("User submitted name:", name);
            activeUsers.push(name);

            if (activeUsers.length > MAX_USERS) {
                let removedUser = activeUsers.shift();
                console.log(`Name "${removedUser}" freed`);
                io.emit('chat-message', {
                    user: 'Server',
                    text: `Username "${removedUser} is now free`
                });
            }
            socket.emit('username-confirmed', name);
        }
        
        console.log(activeUsers);
    });

    socket.on('send-message', (data) => {
        messages.push(data);

        if (messages.length > MAX_MESSAGES) {
            messages.shift();
        }

        io.emit('chat-message', data);
    });
});
