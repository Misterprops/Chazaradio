import express from 'express';
import cors from 'cors';
import ytdlp from 'yt-dlp-exec';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { execa } from 'execa';
import ffmpeg from 'ffmpeg-static';
import { createRequestHandler } from "@react-router/express";
import "react-router";

const app = express();

// Ruta absoluta a la carpeta de build
const clientBuildPath = path.resolve("build/client");

// Sirve los assets generados por Vite
app.use(express.static(clientBuildPath));

// Sirve archivos estáticos del cliente
app.use(
  createRequestHandler({
    build: () =>
      import("virtual:react-router/server-build"),
  }),
);

const port = process.env.PORT || 3000;

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
        /*const outputPath = path.join(mediaFolder, '%(title)s.%(ext)s');

        const result = await ytdlp(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: outputPath,
        });*/
        const info = await ytdlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            preferFreeFormats: true,
            noCheckCertificate: true,
        });

        const title = info.title;
        const outputPath = path.join(mediaFolder, `${title}.webm`);
        const finalAudioPath = path.join(mediaFolder, `${title}.mp3`);

        await ytdlp(url, {
            format: 'bestaudio',
            output: outputPath
        });

        await execa(ffmpeg, [
            '-i', outputPath,
            '-vn',
            '-acodec', 'libmp3lame',
            '-ab', '192k',
            finalAudioPath,
        ]);
        fs.unlinkSync(outputPath);

        console.log('✅ Descarga terminada en:', mediaFolder);
        res.status(200).json({ message: 'Descarga completa' });
    } catch (err) {
        console.error('❌ Error durante la descarga:', err);
        res.status(500).json({ error: 'Fallo al descargar audio' });
    }
});
app.listen(port, () => {
    console.log(`Servidor Node escuchando en http://localhost:${port}`);
});

//uploader
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, mediaFolder),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.post('/api/upload', upload.single('audio'), (req, res) => {
    const fileUrl = `http://localhost:${port}/media/${req.file.filename}`;
    res.json({ url: fileUrl });
});

//fectch audio
app.use("/media", express.static(path.join(__dirname, "../media")));
const uploadsPath = path.join(__dirname, "../media");

app.get("/audios", (req, res) => {
    fs.readdir(uploadsPath, (err, files) => {
        if (err) return res.status(500).send("Error leyendo archivos");

        const audios = files
            .filter(f => f.endsWith(".mp3"))
            .map(f => `http://localhost:${port}/media/${f}`);

        res.json(audios);
    });
});

//mail-sender
import nodemailer from "nodemailer";
var db = {}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anca.mister@gmail.com',
        pass: 'wfly uhty kilm wcbj'
    }
});

function generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // "482903"
}

async function enviarCorreoVerificacion(email, codigo) {
    const mailOptions = {
        from: 'radioChaza <radiochaza@hotmail.com>',
        to: email,
        subject: 'Tu código de verificación',
        html: `<p>Tu código de verificación es:</p><h2>${codigo}</h2><p>Caduca en 10 minutos.</p>`
    };

    await transporter.sendMail(mailOptions);
}

app.post('/api/registro', async (req, res) => {
    const { email, password } = req.body;
    const codigo = generarCodigo();

    // Guardar usuario con código y expiración de 10 minutos
    db = {
        email,
        password,
        isVerified: false,
        verificationCode: codigo,
        codeExpires: Date.now() + 10 * 60 * 1000
    }

    await enviarCorreoVerificacion(email, codigo);

    res.status(200).json({ message: 'Código enviado al correo.' });
});

app.post('/api/verificar', async (req, res) => {
    const { email, codigo } = req.body;

    const user = await db;

    if (!user || user.isVerified) return res.status(400).json({ error: 'Usuario inválido' });

    if (user.verificationCode !== codigo)
        return res.status(400).json({ error: 'Código incorrecto' });

    if (Date.now() > user.codeExpires)
        return res.status(400).json({ error: 'El código expiró' });

    db.verificationCode ? console.log("Es") : console.log("No Es"); // isVerified = true, borrar el código

    res.json({ message: 'Cuenta verificada exitosamente' });
});

//database
import pkg from 'pg';

const conectar = () => {
    const { Client } = pkg;

    const connectionData = {
        user: 'postgres',
        host: 'localhost',
        database: 'RadioChaza',
        password: '123',
        port: 5432,
    }
    const client = new Client(connectionData)
    client.connect()
    return client
}

app.post('/api/user_data', async (req, res) => {
    const { user } = req.body;
    const client = conectar()
    client.query(`select usuarios.user, usuarios.mail from usuarios where usuarios.user = '${user}'`)
        .then(response => {
            const userData = response.rows[0];

            client.end();

            if (response.rows === undefined) return res.status(400).json({ error: 'Usuario inválido' });
            res.json(userData)
        })
        .catch(err => {
            console.log(err)
            client.end()
        })
});

app.post('/api/login', async (req, res) => {
    const { user, password } = req.body;
    const client = conectar()
    client.query(`select usuarios.user, usuarios.validado, usuarios.password from usuarios where usuarios.user = '${user}'`)
        .then(response => {
            const userData = response.rows[0];

            client.end();

            if (response.rows === undefined) return res.status(400).json({ error: 'Usuario inválido' });
            if (!userData.validado) return res.status(400).json({ error: 'Usuario no activo' });
            if (password != userData.password) return res.status(400).json({ error: 'Contraseña incorrecta' });
            res.json({ user: userData.user })
        })
        .catch(err => {
            console.log(err)
            client.end()
        })
});