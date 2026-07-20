import db from '../models/index.js';


export const handleSendMessage = async (io, socket, messageData) => {
  try {

    const savedMessage = await db.Message.create({
      content: messageData.text,
      senderId: socket.user.userId, // Using our secure token data!
      roomId: messageData.roomId 
    });

    io.emit('receiveMessage', savedMessage);
    
  } catch (error) {
    console.error('Error saving message:', error);
    
    socket.emit('messageError', { error: 'Failed to send message' });
  }
};