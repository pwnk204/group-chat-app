let CURRENT_ROOM_ID = null;

API_URL = "/api/v1";

const socket = io({
  withCredentials: true,
});

socket.emit("create", "room1");

async function sendMessage(e) {
  e.preventDefault();

  const messageInput = document.getElementById("message-input");
  const text = messageInput.value.trim();
  if (!text) return;

  socket.emit("new_msg", {
    chat: text,
    roomId: CURRENT_ROOM_ID
  });

  messageInput.value = "";
  messageInput.focus();
}

async function Room() {
  try {

    const response = await axios.post(`${API_URL}/room/meeting`, {
      withCredentials: true,
    });

    const grpName = response.data.data.groupName;

    CURRENT_ROOM_ID = response.data.data.groupName;

    socket.emit('join_room', {
      roomId: grpName
    })

    const chatName = document.getElementById("chat-name");
    chatName.innerText = grpName;

    if(response.data)
    aleart(response.data.message);

  } catch (error) {
    const message = error.response.data.message;
    alert(message);
  }
}

socket.on('msg_rcvd', (data) => {
  const messagesContainer = document.getElementById("messages-container");
  console.log("received data from server: ", data);
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `${data.name}: ${data.chat}`;
  messagesContainer.appendChild(messageElement);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection failed:", err.message);

  if (err.message.includes("Authentication error")) {
    window.location.href = "/login.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");

  const createRoom = document.getElementById("create-room");

  chatForm.addEventListener("submit", sendMessage);

  createRoom.addEventListener("click", Room);
});
