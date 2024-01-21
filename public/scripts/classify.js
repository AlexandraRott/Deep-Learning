

// Функция анализа изображения с использованием ml5.js
function analyzeImage(imageUrl, container, resultId) {
    // document.getElementById("analyzeButton").disabled = true;
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

        // document.getElementById("analyzeButton").disabled = false;
        
    });
}

