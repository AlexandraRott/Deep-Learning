const buttons = document.querySelectorAll('nav ul li a');
const uploadForm = document.getElementById('uploadForm');
const uploadedImage = document.getElementById('uploadedImage');
const imagePreview = document.getElementById('imagePreview');
const documentationContent = document.getElementById('documentationContent');
const examplesContent = document.getElementById('examplesContent'); // Добавлен элемент для отображения примеров

const analyzeButton = document.getElementById('analyzeButton');

analyzeButton.addEventListener('click', () => {
    // Анализируем изображение
    analyzeImage(imagePreview.src);
});

// Функция для изменения размера изображения
function resizeImage(image, maxWidth, maxHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let width = image.width;
    let height = image.height;

    if (width > height) {
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg'); // Можно использовать другой формат, например, 'image/png'
}

// Функция для отображения уменьшенных изображений
function displayExampleImages() {
    examplesContent.innerHTML = '<h2>Examples</h2>';

    const exampleImages = ['11.jpg', '22.jpg', '33.jpg', '44.jpg', '55.jpg', '66.jpg'];

    for (let i = 0; i < exampleImages.length; i += 3) {
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row-container');

        for (let j = 0; j < 3; j++) {
            if (i + j >= exampleImages.length) {
                break;
            }

            const imgContainer = document.createElement('div');
            imgContainer.classList.add('example-container');

            const imgElement = document.createElement('img');
            const image = new Image();
            image.src = `images/${exampleImages[i + j]}`;

            image.onload = () => {
                const resizedImage = resizeImage(image, 300, 300);
                imgElement.src = resizedImage;
            };

            imgElement.classList.add('example-image');
            imgContainer.appendChild(imgElement);

            const analyzeButton = document.createElement('button');
            analyzeButton.textContent = 'Classify';
            analyzeButton.addEventListener('click', () => {
                analyzeImage(`images/${exampleImages[i + j]}`, imgContainer, `analysisResultExample${i + j}`);
            });
            imgContainer.appendChild(analyzeButton);

            // Элемент для отображения результата анализа
            const analysisResult = document.createElement('p');
            analysisResult.classList.add('analysis-result');
            analysisResult.id = `analysisResultExample${i + j}`;
            imgContainer.appendChild(analysisResult);

            rowContainer.appendChild(imgContainer);
        }

        examplesContent.appendChild(rowContainer);
    }

    examplesContent.style.display = 'block';
    uploadForm.style.display = 'none';
    uploadedImage.style.display = 'none';
    documentationContent.style.display = 'none';
}




// Вызываем функцию для отображения примеров изображений при загрузке страницы
displayExampleImages();

const contentBlocks = {
    upload: () => {
        uploadForm.style.display = 'block';
        uploadedImage.style.display = 'none';
        documentationContent.style.display = 'none';
        examplesContent.style.display = 'none';
    },
    documentation: () => {
        uploadForm.style.display = 'none';
        uploadedImage.style.display = 'none';
        documentationContent.style.display = 'block';
        examplesContent.style.display = 'none';
    },
    examples: () => {
        displayExampleImages(); // Вызываем функцию для отображения примеров
    }
};

buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const id = button.getAttribute('id');
        if (contentBlocks[id]) {
            contentBlocks[id]();
        }
    });
});

const uploadImageForm = document.getElementById('uploadImageForm');
uploadImageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(uploadImageForm);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const imageUrl = await response.text();
            imagePreview.src = imageUrl;
            uploadedImage.style.display = 'block';
            uploadForm.style.display = 'none';
            documentationContent.style.display = 'none';
            examplesContent.style.display = 'none';
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
});



// Функция анализа изображения с использованием ml5.js
// Функция для анализа изображения с использованием ml5.js
function analyzeImage(imageUrl, container, resultId) {
    const classifier = ml5.imageClassifier('MobileNet', () => {
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            classifier.predict(img, (err, results) => {
                if (!err) {
                    const prediction = results[0].label;
                    const probability = (results[0].confidence * 100).toFixed(2);

                    let analysisResult;

                    if (resultId) {
                        // Устанавливаем результат анализа текстом в переданный элемент
                        analysisResult = document.getElementById(resultId);
                    } else {
                        // Если resultId не передан, предполагаем, что анализ происходит в разделе "upload your own"
                        // и устанавливаем результат анализа в элемент с id "analysisResult" внутри uploadedImage
                        analysisResult = document.getElementById('analysisResult');
                    }

                    analysisResult.textContent = `It's: "${prediction}" on a picture with ${probability}% confidence.`;

                    // Очистить результат анализа через 5 секунд
                    setTimeout(() => {
                        analysisResult.textContent = '';
                    }, 5000);
                }
            });
        };
    });
}




const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (event) => {
    const formData = new FormData(uploadImageForm);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        // После успешной загрузки изображения
        // После успешной загрузки изображения
        if (response.ok) {
            const imageUrl = await response.text();
            imagePreview.src = imageUrl;
            uploadedImage.style.display = 'block';
            uploadForm.style.display = 'none';
            documentationContent.style.display = 'none';
            examplesContent.style.display = 'none';
        }


    } catch (error) {
        console.error('Upload error:', error);
    }
});

