import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/index";

const app = express();

// Lista de origens permitidas (local + produção)
const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    // Adicione aqui sua URL do Vercel após o deploy:
    // "https://meu-projeto.vercel.app",
    process.env.FRONTEND_URL, // variável de ambiente para o domínio em produção
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

app.use(helmet());
app.use(express.json());
app.use("/api", router);

export default app;
