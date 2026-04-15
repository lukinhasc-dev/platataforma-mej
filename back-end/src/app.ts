import express from "express";
import cors, { type CorsOptions } from "cors";
import helmet from "helmet";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Lista de origens permitidas (local + produção) 
const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://platataforma-mej.vercel.app",
    process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const corsOptions: CorsOptions = {
    origin: (origin: any, callback: any) => {
        // Permite ferramentas como Postman (sem origin)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS bloqueado para origem: ${origin}`));
    },

    credentials: true,
};

app.use(cors(corsOptions));

//Evita o bloqueio de URL's externas como Google Fonts, Vercel, FontAwesome, etc.
app.use(helmet({
    contentSecurityPolicy: false,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

export default app;

