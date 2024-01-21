// Создание и обучение нейронной сети с использованием TensorFlow.js
// Обновленная функция trainModel
// Добавим переменную для хранения текущей обученной модели
let trainedModel = null; // Объявляем переменную, но не инициализируем
let displaySelected = false; // Флаг для отслеживания отображения выбранной функции


async function trainModel(xTrain, yTrain, numEpochs, numHiddenLayers, numNeurons, learningRate, optimizer, activation) {

    console.log(tf);

    trainedModel = null; // Обнуляем trainedModel перед созданием новой модели

    const model = tf.sequential();

    for (let i = 0; i < numHiddenLayers; i++) {
        model.add(tf.layers.dense({ units: numNeurons, activation: activation, inputShape: [1] }));
    }

    model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
    model.compile({ optimizer: tf.train[optimizer](learningRate), loss: 'meanSquaredError' });

    trainedModel = model; // Инициализируем trainedModel


    const xs = tf.tensor2d(xTrain, [xTrain.length, 1]);
    const ys = tf.tensor2d(yTrain, [yTrain.length, 1]);

    console.log('ggg')

    await trainedModel.fit(xs, ys, {
        epochs: numEpochs,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                console.log(`Epoch: ${epoch}, Loss: ${logs.loss}`);
            }
        }
    });

    return trainedModel;
}

// Функция для вычисления значения функции y(x)
function computeFunctionValue(x) {
    return (x + 0.8) * (x - 0.2) * (x - 0.3) * (x - 0.6);
}

// Функция для генерации случайных значений с нормальным распределением (шум)
function randomGaussian(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Пропускаем 0
    while (v === 0) v = Math.random();
    const value = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + value * stdDev;
}

// Функция для генерации обучающих данных с шумом
function generateTrainingData(N, variance) {
    const xTrain = [];
    const yTrain = [];

    for (let i = 0; i < N; i++) {
        const x = Math.random() * 2 - 1; // Генерация случайных значений x в интервале [-1, 1]
        const y = computeFunctionValue(x) + randomGaussian(0, Math.sqrt(variance)); // Добавление шума
        xTrain.push(x);
        yTrain.push(y);
    }

    return { xTrain, yTrain };
}

let myChart; // Объявляем переменную глобально

// Функция для отображения эталонной функции при загрузке страницы
function displayBaseGraph() {
    const xValues = [];
    const yTrueValues = [];
    const step = 0.01;

    // Создаем данные для отображения реальной функции
    for (let x = -1; x <= 1; x += step) {
        xValues.push(x);
        yTrueValues.push(computeFunctionValue(x));
    }

    const yTrueValuesRounded = yTrueValues.map(value => parseFloat(value.toFixed(3)));
    const xValuesRounded = xValues.map(value => parseFloat(value.toFixed(3)));

    myChart = displayGraph(xValuesRounded, yTrueValuesRounded, myChart);
}

// Обработчик события для загрузки эталонной функции при открытии страницы
window.addEventListener('load', displayBaseGraph);

// Функция для отображения эталонной функции на втором графике
function displayBaseGraph2() {
    const xValues = [];
    const yTrueValues = [];

    // Создаем данные для отображения реальной функции
    for (let x = -1; x <= 1; x += 0.01) {
        xValues.push(x);
        yTrueValues.push(computeFunctionValue(x));
    }

    const yTrueValuesRounded = yTrueValues.map(value => parseFloat(value.toFixed(3)));
    const xValuesRounded = xValues.map(value => parseFloat(value.toFixed(3)));

    myChart2 = displayGraph2(xValuesRounded, yTrueValuesRounded, myChart2);
}

// Функция для отображения графика regressionChart2
function displayGraph2(xValues, yTrueValues, myChart2) {
    if (myChart2) {
        myChart2.destroy(); // Уничтожаем предыдущий график
    }

    const chartOptions = {
        chart: {
            type: 'line',
            height: 350,
            animations: {
                enabled: true, // Включаем анимации
                easing: 'easeinout', // Указываем тип анимации (например, плавное затухание)
                speed: 1000, // Скорость анимации в миллисекундах
                animateGradually: {
                    enabled: true,
                    delay: 150 // Задержка перед началом анимации
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350 // Скорость динамической анимации
                }
            }
        },
        series: [
            {
                name: 'True Function',
                data: yTrueValues
            }
        ],
        xaxis: {
            categories: xValues,
            type: "numeric",
            decimalsInFloat: 3,
            tickAmount: 4 // Например, здесь 10 делений на оси X
        }
    };

    const chart = new ApexCharts(document.getElementById('regressionChart2'), chartOptions);
    chart.render();

    return chart;
}

// Обработчик события для отображения эталонной функции на втором графике при загрузке страницы
window.addEventListener('load', displayBaseGraph2);


// Функция для отображения графика
function displayGraph(xValues, yTrueValues, myChart) {
    if (myChart) {
        myChart.destroy(); // Уничтожаем предыдущий график
    }

    const chartOptions = {
        chart: {
            type: 'line',
            height: 350,
            animations: {
                enabled: true, // Включаем анимации
                easing: 'easeinout', // Указываем тип анимации (например, плавное затухание)
                speed: 1000, // Скорость анимации в миллисекундах
                animateGradually: {
                    enabled: true,
                    delay: 150 // Задержка перед началом анимации
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350 // Скорость динамической анимации
                }
            }
        },
        series: [
            {
                name: 'True Function',
                data: yTrueValues
            }
        ],
        xaxis: {
            categories: xValues,
            type: "numeric",
            decimalsInFloat: 3,
            tickAmount: 4 // Например, здесь 10 делений на оси X

        }
    };

    const chart = new ApexCharts(document.getElementById('regressionChart'), chartOptions);
    chart.render();

    return chart;
}


// Функция для получения выбранного значения из списка
function getSelectedValue(elementId) {
    const selectElement = document.getElementById(elementId);
    return selectElement.options[selectElement.selectedIndex].value;
}

// Создание и обучение нейронной сети с использованием TensorFlow.js
async function trainModelAndVisualize() {
    document.getElementById("trainButton").disabled = true;
    document.getElementById("trainAgainButton").disabled = true;
    document.getElementById("downloadButton").disabled = true;
    const N = parseInt(document.getElementById('dataSize').value);
    const variance = parseFloat(document.getElementById('noiseVariance').value);
    const numEpochs = parseInt(document.getElementById('numEpochs').value);
    const numHiddenLayers = parseInt(document.getElementById('hiddenLayers').value);
    const numNeurons = parseInt(document.getElementById('neurons').value);
    const learningRate = parseFloat(document.getElementById('learningRate').value);
    const optimizer = getSelectedValue('optimizer');
    const activation = getSelectedValue('activation');

    const { xTrain, yTrain } = generateTrainingData(N, variance);
    const trainedModel = await trainModel(xTrain, yTrain, numEpochs, numHiddenLayers, numNeurons, learningRate, optimizer, activation);

    document.getElementById('trainAgainButton').style.display = 'block';
    document.getElementById('downloadButton').style.display = 'block';

    const xValues = [];
    const yTrueValues = [];
    const step = 0.01;

    // Создаем данные для отображения реальной функции
    for (let x = -1; x <= 1; x += step) {
        xValues.push(x);
        yTrueValues.push(computeFunctionValue(x));
    }

    // Создаем данные для отображения реальной функции
    const yTrueValuesRounded = yTrueValues.map(value => parseFloat(value.toFixed(3)));
    const xValuesRounded = xValues.map(value => parseFloat(value.toFixed(3)));

    myChart = displayGraph(xValuesRounded, yTrueValuesRounded, myChart);


    // Делаем предсказания для значений x и получаем предсказанные значения y
    const yPredictedValues = [];
    for (let i = 0; i < xValues.length; i++) {
        const prediction = trainedModel.predict(tf.tensor2d([[xValues[i]]])).dataSync()[0];
        yPredictedValues.push(prediction);
    }

    // Округляем предсказанные значения до 3 знаков после запятой
    const yPredictedValuesRounded = yPredictedValues.map(value => parseFloat(value.toFixed(3)));


    // Обновляем данные графика с учетом предсказанных значений
    myChart.updateSeries([
        {
            name: 'True Function',
            data: yTrueValuesRounded
        },
        {
            name: 'Predicted Function',
            data: yPredictedValuesRounded
        }
    ]);

    document.getElementById("trainButton").disabled = false;
    document.getElementById("trainAgainButton").disabled = false;
    document.getElementById("downloadButton").disabled = false;

}

// Функция для повторного обучения модели
async function trainAgain() {
    document.getElementById("trainButton").disabled = true;
    document.getElementById("trainAgainButton").disabled = true;
    document.getElementById("downloadButton").disabled = true;

    const N = parseInt(document.getElementById('dataSize').value);
    const variance = parseFloat(document.getElementById('noiseVariance').value);
    const numEpochs = parseInt(document.getElementById('numEpochs').value);
    const numHiddenLayers = parseInt(document.getElementById('hiddenLayers').value);
    const numNeurons = parseInt(document.getElementById('neurons').value);
    const learningRate = parseFloat(document.getElementById('learningRate').value);
    const optimizer = getSelectedValue('optimizer');
    const activation = getSelectedValue('activation');

    const { xTrain, yTrain } = generateTrainingData(N, variance);

    if (!trainedModel) {
        trainedModel = await trainModel(xTrain, yTrain, numEpochs, numHiddenLayers, numNeurons, learningRate, optimizer, activation);
    } else {
        const xs = tf.tensor2d(xTrain, [xTrain.length, 1]);
        const ys = tf.tensor2d(yTrain, [yTrain.length, 1]);

        await trainedModel.fit(xs, ys, {
            epochs: numEpochs,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    console.log(`Epoch: ${epoch}, Loss: ${logs.loss}`);
                }
            }
        });
    }

    const xValues = [];
    const step = 0.01;

    for (let x = -1; x <= 1; x += step) {
        xValues.push(x);
    }

    const yTrueValues = xValues.map(x => computeFunctionValue(x));
    const xValuesTensor = tf.tensor2d(xValues, [xValues.length, 1]);
    const yPredictedValues = trainedModel.predict(xValuesTensor).dataSync();

    const yTrueValuesRounded = yTrueValues.map(value => parseFloat(value.toFixed(3)));
    const yPredictedValuesRounded = Array.from(yPredictedValues).map(value => parseFloat(value.toFixed(3)));

    myChart.updateSeries([
        {
            name: 'True Function',
            data: yTrueValuesRounded
        },
        {
            name: 'Predicted Function',
            data: yPredictedValuesRounded
        }
    ]);
    document.getElementById("trainButton").disabled = false;
    document.getElementById("trainAgainButton").disabled = false;
    document.getElementById("downloadButton").disabled = false;
}


// Функция для сохранения модели
async function saveModel() {
    if (trainedModel) {
        const saveResults = await trainedModel.save('downloads://trained_model');
        console.log(saveResults);

        //const modelJSON = await trainedModel.toJSON();
        // const modelData = JSON.stringify(modelJSON, null, 2).replace(/\\\"/g, '"'); // Замена экранированных кавычек

        // Создаем ссылку на файл
        //const blob = new Blob([modelData], { type: 'application/json' });
        //const url = URL.createObjectURL(blob);

        // Создаем ссылку для скачивания файла
        //const downloadLink = document.createElement('a');
        //downloadLink.href = url;
        //downloadLink.download = 'trained_model.json';
        //downloadLink.click();

        // Очищаем ссылку после скачивания файла
        // URL.revokeObjectURL(url);

    } else {
        console.log('Модель еще не обучена');
    }
}




// Брэд
// async function ss() {
//     const loadedModel = await tf.loadLayersModel('../models/underfitting2.json');
//     console.log('Prediction from loaded model:');
//     loadedModel.predict(tf.ones([1, 3])).print();

// }

// window.addEventListener('load', ss);





// Функции для отображения моделей

// Функция для загрузки модели из JSON-файла
async function loadModel(filename) {

    // const jsonData = await fetch(`../models/${filename}.json`);

    // const data = await response.json();

    const model = await tf.loadLayersModel(`../models/${filename}/trained_model.json`);
    

    console.log(model);
    return model;
}

// // Функция для создания модели на основе данных из JSON-файла
// async function createModelFromJSON(jsonData) {
//     const model = await tf.loadLayersModel(tf.io.fromJSON(JSON.stringify(jsonData)));
//     return model;
// }

// Функция для отображения модели на графике
// Функция для отображения модели на графике
// Функция для отображения модели на графике
async function displayModelGraph(filename) {
    const model = await loadModel(filename); // Загружаем модель

    const xValues = [];
    const yValues = [];
    const yTrueValues = []; // Сохраняем эталонные значения

    const step = 0.01;

    for (let x = -1; x <= 1; x += step) {
        xValues.push(x);
        const tensor = tf.tensor2d([[x]]);
        const prediction = model.predict(tensor).dataSync()[0];
        yValues.push(prediction);
        yTrueValues.push(computeFunctionValue(x)); // Получаем эталонные значения
    }

    // Отобразить на графике
    if (myChart2) {
        myChart2.destroy(); // Уничтожаем предыдущий график
    }

    const chartOptions = {
        chart: {
            type: 'line',
            height: 350,
            animations: {
                enabled: true // Включаем анимацию
            }
        },
        series: [
            {
                name: 'True Function',
                data: yTrueValues.map(value => parseFloat(value.toFixed(3))) // Используем эталонные значения для этой серии
            },
            {
                name: 'Predicted Function',
                data: yValues.map(value => parseFloat(value.toFixed(3)))
            }
        ],
        xaxis: {
            categories: xValues.map(value => parseFloat(value.toFixed(3))),
            type: "numeric",
            decimalsInFloat: 3,
            tickAmount: 4 // Например, здесь 10 делений на оси X
        }
    };

    myChart2 = new ApexCharts(document.getElementById('regressionChart2'), chartOptions);
    myChart2.render();
}

// Функция для отображения выбранной модели на графике regressionChart2
function displaySelectedModel(selectedModel) {
    switch (selectedModel) {
        case 'uf':
            displayModelGraph('underfitting'); // Загружаем и отображаем модель underfitting
            break;
        case 'bf':
            displayModelGraph('bestfitting'); // Загружаем и отображаем модель bestfitting
            break;
        default:
            break;
    }
}







let myChart2; // Объявляем переменную глобально

// Функция для отображения выбранной модели на графике regressionChart2
let yValuesTrue; // Объявляем переменную для эталонной функции

// Обработчик события для кнопки Load Model
document.getElementById('loadButton').addEventListener('click', function () {
    const selectedModel = document.querySelector('input[name="chooseModel"]:checked').value;
    displaySelectedModel(selectedModel); // Отображаем выбранную модель
});

// Обработчик события для кнопки загрузки модели
document.getElementById('downloadButton').addEventListener('click', saveModel);

// Обработчик события для кнопки обучения модели
document.getElementById('trainButton').addEventListener('click', trainModelAndVisualize);

// Обработчик события для кнопки повторного обучения модели
document.getElementById('trainAgainButton').addEventListener('click', trainAgain);

