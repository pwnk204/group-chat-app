import express  from "express";
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { ServerConfig } from "./config/index.js";
import apiRoutes from "./routes/index.js";
import db from "./models/index.js"
import { createServer } from 'node:http';
import {Server} from 'socket.io'


const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("filename: ", __filename, ' ', "dirname: ", __dirname);


app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});


io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message.text);
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// app.use("/api", apiRoutes);

server.listen(ServerConfig.port , (err) => {
    console.log(`Server is up and listening on port: ${ServerConfig.port}`)
})