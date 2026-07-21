import db from '../models/index.js';
import message from '../models/message.js';


export const handleSendMessage = async (io, socket, messageData) => {
  try {

    // const savedMessage = await db.Message.create({
    // //   content: messageData.text,
    // //   senderId: socket.user.userId,
    // //   roomId: messageData.roomId 
    // // });

    const user = await db.User.findByPk(socket.user.userId);

    io.emit('receiveMessage', {name: user.name, message: messageData});
    
  } catch (error) {
    console.error('Error saving message:', error);
    
    socket.emit('messageError', { error: 'Failed to send message' });
  }
};