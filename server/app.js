const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const app = express();

const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, '../public')));

 app.get('/', (req, res) => {
     console.log('Received a request for the homepage');
     res.sendFile(path.join(__dirname, '../index.html'));
 });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const buffer = req.file.buffer;
        const resizedImage = await sharp(buffer)
            .resize({ width: 300, height: 300, fit: 'inside' })
            .toBuffer();

        const imageName = `upload/${req.file.originalname}`;
        await sharp(resizedImage).toFile(path.join(__dirname, '../public', imageName));

        console.log(`File "${req.file.originalname}" uploaded successfully.`); // Логирование успешной загрузки
        res.send(imageName);
    } catch (error) {
        console.error('Image processing error:', error);
        res.status(500).send('Image processing error');
    }
});

app.listen(port, () => {
    console.log(`Server runs on port: ${port}`);
});
