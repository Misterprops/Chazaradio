import express from 'express';
import cors from 'cors';
import ytdlp from 'yt-dlp-exec';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const app = express();
const PORT = 3001;

// 🧭 Rutas relativas para carpeta media
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mediaFolder = path.resolve(__dirname, '../media');

// 📁 Asegura que la carpeta exista
if (!fs.existsSync(mediaFolder)) {
    fs.mkdirSync(mediaFolder, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.post('/api/descargar', async (req, res) => {
    console.log('📂 __dirname:', __dirname);
    console.log('📂 mediaFolder:', mediaFolder);
    console.log('📂 cwd:', process.cwd());
    const { url } = req.body;
    if (!url) {
        console.log("❌ Error: Debes proporcionar una URL de YouTube.");
        return;
    }

    try {
        const outputPath = path.join(mediaFolder, '%(title)s.%(ext)s');

        const result = await ytdlp(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: outputPath,
        });
        console.log('✅ Descarga terminada en:', mediaFolder);
        res.status(200).json({ message: 'Descarga completa' });
    } catch (err) {
        console.error('❌ Error durante la descarga:', err);
        res.status(500).json({ error: 'Fallo al descargar audio' });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor Node escuchando en http://localhost:${PORT}`);
});

//uploader
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, mediaFolder),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.post('/api/upload', upload.single('audio'), (req, res) => {
    const fileUrl = `http://localhost:${PORT}/media/${req.file.filename}`;
    res.json({ url: fileUrl });
});

//fectch audio
app.use("/media", express.static(path.join(__dirname, "../media")));
const uploadsPath = path.join(__dirname, "../media");

app.get("/audios", (req, res) => {
    fs.readdir(uploadsPath, (err, files) => {
        if (err) return res.status(500).send("Error leyendo archivos");

        const audios = files
            .filter(f => f.endsWith(".webm"))
            .map(f => `http://localhost:${PORT}/media/${f}`);

        res.json(audios);
    });
});