import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();

// Lista de origens permitidas (local + produção) 
const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Permite chamadas sem origin (ex: Postman, curl, apps mobile)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS bloqueado para origem: ${origin}`));
    },
    credentials: true,
}));

//Evita o bloqueio de URL's externas como Google Fonts, Vercel, FontAwesome, etc.
app.use(helmet({
    contentSecurityPolicy: false,
}));

app.use(express.json());
app.use(cookieParser());

// Serve os arquivos estáticos do frontend (JS, CSS, imagens, etc.)
app.use(express.static(path.join(process.cwd(), '..', 'front-end')));

app.use("/api", router);

export default app;

