import express  from "express";
import cookieParser from 'cookie-parser';
import { ServerConfig } from "./config/index.js";
import apiRoutes from "./routes/index.js"


const app = express();


app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());

// app.use("/", (req, res) => {
//     res.send('Basice setup is working');
// })

app.use("/api", apiRoutes);

app.listen(ServerConfig.port , (err) => {
    console.log(`Server is up and listening on port: ${ServerConfig.port}`)
})