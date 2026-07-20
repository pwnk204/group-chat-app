import {MessageController}  from '../controllers/index.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`Authenticated user connected: User ID ${socket.user.userId}`);

    socket.on('sendMessage', (messageData) => {
      MessageController.handleSendMessage(io, socket, messageData);
    });

    socket.on('disconnect', () => {
      console.log(`User ID ${socket.user.userId} disconnected`);
    });
  });
};