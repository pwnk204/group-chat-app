import {MessageController}  from '../controllers/index.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`Authenticated user connected, UserID:- ${socket.user.userId}`);

    socket.on('join_room', (data) => {
      socket.join(data.roomId)
    })

    socket.on('new_msg', async (data) => {
      try {
        const name = await MessageController.handleSendMessage(io, socket);
        data.name = name;
        io.to(data.roomId).emit('msg_rcvd', data);
      } catch (error) {
        console.log("something went wrong while sending message in group: ", data.roomId);
      }
    })

    socket.on('disconnect', () => {
      console.log(`User ID ${socket.user.userId} disconnected`);
    });
  });
};