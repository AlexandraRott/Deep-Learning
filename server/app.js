const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp'); // Подключаем библиотеку sharp
const app = express();
const port = 3000;

// Настройка папки для загрузки изображений
const storage = multer.memoryStorage(); // Меняем на memoryStorage для обработки в памяти
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, '../images'))); // Позволяет обслуживать статические файлы

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Разрешаем доступ к статическим файлам (изображениям)
app.use(express.static(path.join(__dirname, '../')));

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const buffer = req.file.buffer;
        const resizedImage = await sharp(buffer)
            .resize({ width: 500, height: 500, fit: 'inside' }) // Масштабируем изображение до 500px с сохранением пропорций
            .toBuffer(); // Преобразуем в буфер

        // Загруженное изображение будет сохранено с новым размером
        const imageName = `upload/${req.file.originalname}`;
        await sharp(resizedImage).toFile(path.join(__dirname, '../', imageName));

        // Возвращаем URL загруженного изображения
        res.send(imageName);
    } catch (error) {
        console.error('Image processing error:', error);
        res.status(500).send('Image processing error');
    }
});

app.listen(port, () => {
    console.log(`Server runs on port: ${port}`);
});
