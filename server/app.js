const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp'); // Подключаем библиотеку sharp
const app = express();

// Установите желаемый порт
const port = process.env.PORT || 3000;

// Настройка папки для загрузки изображений
const storage = multer.memoryStorage(); // Меняем на memoryStorage для обработки в памяти
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    console.log('Received a request for the homepage'); // Логирование информационного сообщения
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const buffer = req.file.buffer;
        const resizedImage = await sharp(buffer)
            .resize({ width: 500, height: 500, fit: 'inside' })
            .toBuffer();

        const imageName = `upload/${req.file.originalname}`;
        await sharp(resizedImage).toFile(path.join(__dirname, '../public', imageName));

        res.send(imageName);
    } catch (error) {
        console.error('Image processing error:', error); // Логирование ошибки
        res.status(500).send('Image processing error');
    }
});

app.listen(port, () => {
    console.log(`Server runs on port: ${port}`); // Логирование информационного сообщения
});
