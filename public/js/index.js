const CURRENT_ROOM_ID = 1;
const CURRENT_USER_ID = 1;

const socket = io();

async function sendMessage(e) {
  e.preventDefault();

  const messageInput = document.getElementById("message-input");
  const text = messageInput.value.trim();
  if (!text) return;

  socket.emit('sendMessage', {
    text: text,
    senderId: CURRENT_USER_ID,
    roomId: CURRENT_ROOM_ID
  });

  messageInput.value = "";
  messageInput.focus();
}

socket.on('receiveMessage', (message) => {
    const messagesContainer = document.getElementById('messages-container');

    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messagesContainer.appendChild(messageElement);

})

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");

  chatForm.addEventListener("submit", sendMessage);
});
