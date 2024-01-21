const imagePreview = document.getElementById('imagePreview');
const uploadForm = document.getElementById('uploadForm');
const uploadedImage = document.getElementById('uploadedImage');
const uploadImageForm = document.getElementById('uploadImageForm');
const analyzeButton = document.getElementById('analyzeButton');
const fileInput = document.getElementById('fileInput');

uploadImageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(uploadImageForm);

    try {
        const response = await fetch('/imgupload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const imageUrl = await response.text();
            imagePreview.src = imageUrl;
            uploadedImage.style.display = 'block';
            uploadForm.style.display = 'none';
        }
    } catch (error) {
        console.error('Upload error:', error);
    }

});


fileInput.addEventListener('change', async (event) => {
    const formData = new FormData(uploadImageForm);

    try {
        const response = await fetch('/imgupload', {
            method: 'POST',
            body: formData,
        });

        // После успешной загрузки изображения
        if (response.ok) {
            const imageUrl = await response.text();
            imagePreview.src = imageUrl;
            uploadedImage.style.display = 'block';
            uploadForm.style.display = 'none';
        }


    } catch (error) {
        console.error('Upload error:', error);
    }
});


analyzeButton.addEventListener('click', () => {
    // Анализируем изображение
    analyzeImage(imagePreview.src);
});

