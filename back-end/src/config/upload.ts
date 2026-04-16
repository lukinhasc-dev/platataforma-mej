import multer from 'multer';
import { Request } from 'express';

// Usar memoryStorage: o arquivo fica em buffer na memória
// e é enviado diretamente ao Supabase Storage (sem salvar no disco)
const storage = multer.memoryStorage();

// Filtro para selecionar os tipos permitidos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-word',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'application/zip',
        'application/x-rar-compressed',
        'video/mp4'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato inválido! Apenas PDF, PowerPoint, Word, Excel, PNG e JPEG.'));
    }
};

// Máximo de 50MB por arquivo
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

export default upload;