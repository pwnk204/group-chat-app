const CURRENT_ROOM_ID = 1;
const CURRENT_USER_ID = 1;

async function sendMessage(e) {
  e.preventDefault();

  const messageInput = document.getElementById("message-input");

  const text = messageInput.value.trim();
  if (!text) return;

  messageInput.value = "";
  messageInput.focus();

  try {
    const response = await axios.post("/api/messages", {
      text: text,
      senderId: CURRENT_USER_ID,
      roomId: CURRENT_ROOM_ID,
    });

    if (response.ok) {
      const savedMessage = await response.json();
      appendMessageToUI(savedMessage);
    } else {
      console.error("Failed to send message");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function loadInitialMessages() {
  try {
    const response = await axios.get(`/api/messages/${CURRENT_ROOM_ID}`);
    const messages = await response.json();

    messagesContainer.innerHTML = "";

    messages.forEach((message) => {
      const messageElement = document.createElement("div");

      if (message.senderId === CURRENT_USER_ID) {
        messageElement.classList.add("message", "sent");
      } else {
        messageElement.classList.add("message", "received");
      }

      const timeString = new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      messageElement.innerHTML = `
        <p>${message.text}</p>
        <span class="time">${timeString}</span>
      `;

      messagesContainer.appendChild(messageElement);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (error) {
    console.error("Error loading initial messages:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");

  chatForm.addEventListener("submit", sendMessage);

  loadInitialMessages();
});
