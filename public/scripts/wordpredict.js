// Функция загрузки обеих моделей
async function loadModels() {
    const rnnModel = await tf.loadLayersModel('lang_models/rnn_model/model.json');
    const ffnnModel = await tf.loadLayersModel('lang_models/ffnn_model/model.json');
    return { rnnModel, ffnnModel };
}

// Функция предсказания следующих слов
async function predictNextWords() {
    const inputTextElement = document.getElementById('inputText');
    const outputElement = document.getElementById('output');
    const predCountElement = document.getElementById('predCount');
    const modTypeSelect = document.getElementById('modType');

    // Получаем введенный текст из текстового поля
    const inputText = inputTextElement.value.trim().toLowerCase();

    if (!inputText) {
        alert('No text to predict.');
        return;
    }

    // Получаем количество предсказаний из инпута
    const predCount = parseInt(predCountElement.value, 10) || 3;

    // Получаем выбранный тип модели
    const modType = modTypeSelect.value;

    // Загружаем обе модели
    const { rnnModel, ffnnModel } = await loadModels();

    // Выбираем нужную модель в зависимости от выбора
    const model = modType === 'RNN' ? rnnModel : ffnnModel;

    // Подготавливаем входные данные для модели
    const inputSequence = tokenizeInputText(inputText);

    // Выполняем предсказание
    const predictedToken = model.predict(tf.tensor2d(inputSequence, [1, inputSequence.length]));

    // Получаем топ-индексы токенов с наивысшими вероятностями
    const topKIndices = tf.topk(predictedToken, predCount).indices.dataSync();

    // Получаем слова, соответствующие топ-индексам токенов, из токенизатора
    const predictedWords = [];
    for (let i = 0; i < topKIndices.length; i++) {
        const index = topKIndices[i];
        const word = tokenizer.index_word[index] || 'UNKNOWN';
        predictedWords.push(word);
    }

    // Выводим предсказанные слова
    outputElement.innerHTML = `<p>Top-${predCount} predicted words: ${predictedWords.map(word => `<a href="#" class="predicted-word">${word}</a>`).join(', ')}</p>`;
}


// Токенизация введенного текста
function tokenizeInputText(inputText) {
    // Ваш код для токенизации текста, например, разбивки на слова
    const words = inputText.split(' ');

    // Ваш код для преобразования слов в индексы с использованием токенизатора
    const inputSequence = words.map(word => tokenizer.word_index[word] || 0);

    // Заполнение последовательности токенов до длины 215 (если короче)
    while (inputSequence.length < 215) {
        inputSequence.unshift(0);  // Добавляйте пустые токены в начало
    }

    // Обрезка последовательности токенов до длины 215 (если длиннее)
    inputSequence.splice(215);

    return inputSequence;
}



// Переменная для хранения токенизатора
let tokenizer;

// Загрузка токенизатора
async function loadTokenizer() {
    const response = await fetch('lang_models/tokenizer.json');
    tokenizer = await response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    loadTokenizer();

    const inputTextElement = document.getElementById('inputText');
    const outputElement = document.getElementById('output');
    const modTypeSelect = document.getElementById('modType');
    const predCountSelect = document.getElementById('predCount');

    // Добавляем слушателя события "input" на инпут
    inputTextElement.addEventListener('input', () => {
        // Очищаем вывод при каждом изменении в инпуте
        outputElement.innerHTML = '';
    });

    // Добавляем слушателя события "input" на модель
    modTypeSelect.addEventListener('input', () => {
        // Вызываем функцию predictNextWords только если инпут непустой
        if (inputTextElement.value.trim() !== '') {
            predictNextWords();
        }
    });

    // Добавляем слушателя события "input" на количество предсказаний
    predCountSelect.addEventListener('input', () => {
        // Вызываем функцию predictNextWords только если инпут непустой
        if (inputTextElement.value.trim() !== '') {
            predictNextWords();
        }
    });

    inputTextElement.addEventListener('input', (event) => {
        const inputValue = event.target.value;

        // Проверяем, является ли последний введенный символ пробелом
        if (inputValue.endsWith(' ')) {
            // Вызываем функцию predictNextWords только если инпут непустой
            if (inputTextElement.value.trim() !== '') {
                predictNextWords();
            }
        }
    });

    // Обработчик события для вставки слова в инпут
    function handleWordClick(event) {
        const clickedWord = event.target.textContent;

        // Добавляем слово в инпут
        inputTextElement.value += clickedWord + ' ';

        // Очищаем вывод
        outputElement.innerHTML = '';

        inputTextElement.focus();

        predictNextWords();
    }

    // Добавляем обработчик события к outputElement
    outputElement.addEventListener('click', (event) => {
        // Проверяем, было ли кликнуто на ссылку
        if (event.target.tagName === 'A') {
            // Обработка клика на слово
            handleWordClick(event);
        }
    });
});

