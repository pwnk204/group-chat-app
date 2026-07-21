import express  from "express";
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { ServerConfig } from "./config/index.js";
import apiRoutes from "./routes/index.js";
import db from "./models/index.js"
import { createServer } from 'node:http';
import {Server} from 'socket.io'
import jwt from "jsonwebtoken"
import { setupSocketHandlers } from "./sockets/index.js";


const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
})

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

io.engine.use(cookieParser());

io.use((socket, next) => {
  try {
    const token = socket.request.cookies.token; 

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    console.log("token at socket.io auth: ", token)

    const secretKey = process.env.JWT_SECRET || 'super_secret_key';
    const decodedUser = jwt.verify(token, secretKey);

    console.log({user: decodedUser});

    socket.user = decodedUser;
    next();
    
  } catch (err) {
    console.error('Socket Auth Error:', err.message);
    return next(new Error('Authentication error: Invalid token'));
  }
});


setupSocketHandlers(io);

app.use("/api", apiRoutes);

server.listen(ServerConfig.port , (err) => {
    console.log(`Server is up and listening on port: ${ServerConfig.port}`)
})