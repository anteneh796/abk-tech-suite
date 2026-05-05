const { Server } = require('socket.io');

let io;

const init = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their notification room`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

const sendNotification = (userId, type, payload) => {
    if (io) {
        io.to(userId).emit('notification', { type, ...payload, timestamp: new Date() });
    }
};

const broadcast = (type, payload) => {
    if (io) {
        io.emit('broadcast', { type, ...payload, timestamp: new Date() });
    }
};

module.exports = { init, sendNotification, broadcast };
