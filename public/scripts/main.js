// const buttons = document.querySelectorAll('nav ul li a');
const examplesContent = document.getElementById('examplesContent');
const analyzeButton = document.getElementById('analyzeButton');

// Вызываем функцию для отображения примеров изображений при загрузке страницы
displayExampleImages();

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




