const buttons = document.querySelectorAll('nav ul li a');
const uploadForm = document.getElementById('uploadForm');
const uploadedImage = document.getElementById('uploadedImage');
const imagePreview = document.getElementById('imagePreview');
const documentationContent = document.getElementById('documentationContent');
const examplesContent = document.getElementById('examplesContent');
const regressionContent = document.getElementById('regressionContent');
const analyzeButton = document.getElementById('analyzeButton');
const regressionChartCanvas = document.getElementById('regressionChart');

// Вызываем функцию для отображения примеров изображений при загрузке страницы
displayExampleImages();

const TABS = [
    uploadForm, uploadedImage, documentationContent,
    examplesContent, regressionContent
];

const displayTab = (tab) => {
    TABS.map((item) => item.id === tab ? item.style.display = 'block' : item.style.display = 'none');
}

const contentBlocks = {
    upload: () => displayTab('uploadForm'),
    documentation: () => displayTab('documentationContent'),
    regression: () => {
        initDefaultRegressionChart();
        displayTab('regressionContent');
    },
    examples: () => {
        displayTab('examplesContent');
        displayExampleImages(); // Вызываем функцию для отображения примеров
    }
};

buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const id = button.getAttribute('id');
        contentBlocks?.[id]();
    });
});

// Функция для отображения уменьшенных изображений
function displayExampleImages() {
    examplesContent.innerHTML = '<h2>Examples</h2>';

    const exampleImages = ['11.jpg', '22.jpg', '33.jpg', '44.jpg', '55.jpg', '66.jpg'];

    const container = document.createElement('div');
    container.classList.add('flex-container');

    exampleImages.map((item, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('example-container');

        const imgElement = document.createElement('img');
        imgElement.src = `images/${item}`;

        imgElement.classList.add('example-image');
        imgContainer.appendChild(imgElement);

        const analyzeButton = document.createElement('button');
        analyzeButton.textContent = 'Classify';
        analyzeButton.addEventListener('click', () => {
            analyzeImage(`images/${item}`, imgContainer, `analysisResultExample${index}`);
        });
        imgContainer.appendChild(analyzeButton);

        // Элемент для отображения результата анализа
        const analysisResult = document.createElement('p');
        analysisResult.classList.add('analysis-result');
        analysisResult.id = `analysisResultExample${index}`;
        imgContainer.appendChild(analysisResult);

        container.appendChild(imgContainer);
    });

    examplesContent.appendChild(container);
}



analyzeButton.addEventListener('click', () => {
    // Анализируем изображение
    analyzeImage(imagePreview.src);
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
function analyzeImage(imageUrl, container, resultId) {
    const classifier = ml5.imageClassifier('MobileNet', () => {
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            classifier.predict(img, (err, results) => {
                if (!err) {
                    const prediction = results[0].label;
                    const probability = (results[0].confidence * 100).toFixed(2);

                    const analysisResult = resultId ? document.getElementById(resultId) : document.getElementById('analysisResult');

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


function initDefaultRegressionChart() {
    regressionContent.style.display = 'block';

    const regressionChartElement = document.getElementById('regressionChart');

    const options = {
        chart: {
            type: 'line',
            height: 500,
        },
        series: [
            {
                name: 'y = a*x + b',
                data: [],
            },
        ],
        xaxis: {
            categories: [],
        },
    };

    const regressionChart = new ApexCharts(regressionChartElement, options);
    regressionChart.render();

    // Сохраните объект графика в глобальной переменной
    window.regressionChart = regressionChart;

    // Установите значения по умолчанию (a=1, b=0)
    updateRegressionChart(1, 0);
}

const updateRegressionButton = document.getElementById('updateRegression');
updateRegressionButton.addEventListener('click', () => {
    // Получите значения a и b из инпутов
    const a = parseFloat(document.getElementById('inputA').value);
    const b = parseFloat(document.getElementById('inputB').value);

    // Обновите график с новой функцией y = x * a + b
    updateRegressionChart(a, b);
});

// Функция для обновления графика с новыми значениями a и b
function updateRegressionChart(a, b) {
    // Получите объект графика
    const regressionChart = window.regressionChart;

    // Обновите данные для графика на основе новых значений a и b
    const newData = [];
    for (let x = -10; x <= 10; x++) {
        newData.push(x * a + b);
    }

    // Обновите данные графика
    regressionChart.updateSeries([
        {
            name: 'y = ax+b',
            data: newData,
        },
    ]);
}
