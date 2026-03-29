import dotenv from 'dotenv';
dotenv.config(); // Carrega o .env antes de qualquer import que dependa de process.env

import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT} 🚀`);
});

