import express  from "express";
import cookieParser from 'cookie-parser';
import { ServerConfig } from "./config/index.js";
import apiRoutes from "./routes/index.js";
import db from "./models/index.js"


const app = express();


app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());

app.get('/api/messages/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await db.Message.findAll({
      where: { roomId: roomId },
      order: [['createdAt', 'ASC']]
    });

    const formattedMessages = messages.map(msg => ({
      text: msg.content,
      senderId: msg.senderId,
      createdAt: msg.createdAt
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages from the database' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { text, senderId, roomId } = req.body;

    const savedMessage = await db.Message.create({
      content: text,
      senderId: senderId,
      roomId: roomId
    });

    res.status(201).json({
      text: savedMessage.content,
      senderId: savedMessage.senderId,
      createdAt: savedMessage.createdAt
    });

  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message to the database' });
  }
});

// app.use("/api", apiRoutes);

app.listen(ServerConfig.port , (err) => {
    console.log(`Server is up and listening on port: ${ServerConfig.port}`)
})