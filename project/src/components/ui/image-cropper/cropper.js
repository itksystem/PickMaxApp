document.addEventListener("DOMContentLoaded", () => {
    const imageCropper = document.getElementById("imageCropper");
    const imageCanvas = document.getElementById("imageCanvas");
    const selectionBox = document.getElementById("selectionBox");

    let isSelecting = false;
    let startX, startY;

    // Загрузка изображения
    const loadImage = (url) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            const ctx = imageCanvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
        };
    };

    // Пример загрузки изображения
    loadImage("https://via.placeholder.com/600x400"); // Можно заменить на любое изображение

    // Обработка нажатия мыши
    imageCanvas.addEventListener("mousedown", (e) => {
        isSelecting = true;
        startX = e.offsetX;
        startY = e.offsetY;

        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        selectionBox.style.width = "0px";
        selectionBox.style.height = "0px";
    });

    // Обработка перемещения мыши
    imageCanvas.addEventListener("mousemove", (e) => {
        if (!isSelecting) return;

        const rect = imageCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = currentX - startX;
        const height = currentY - startY;

        selectionBox.style.width = `${Math.abs(width)}px`;
        selectionBox.style.height = `${Math.abs(height)}px`;

        if (width < 0) {
            selectionBox.style.left = `${startX + width}px`;
        } else {
            selectionBox.style.left = `${startX}px`;
        }

        if (height < 0) {
            selectionBox.style.top = `${startY + height}px`;
        } else {
            selectionBox.style.top = `${startY}px`;
        }
    });

    // Обработка отпускания мыши
    imageCanvas.addEventListener("mouseup", () => {
        isSelecting = false;
    });

    // Функция обрезки изображения
    const cropImage = () => {
        const rect = selectionBox.getBoundingClientRect();
        const ctx = imageCanvas.getContext("2d");

        const croppedCanvas = document.createElement("canvas");
        const croppedCtx = croppedCanvas.getContext("2d");

        croppedCanvas.width = rect.width;
        croppedCanvas.height = rect.height;

        croppedCtx.drawImage(
            imageCanvas,
            rect.left - imageCanvas.getBoundingClientRect().left,
            rect.top - imageCanvas.getBoundingClientRect().top,
            rect.width,
            rect.height,
            0,
            0,
            rect.width,
            rect.height
        );

        const croppedImage = croppedCanvas.toDataURL("image/png");
        alert("Обрезанное изображение:\n" + croppedImage);
    };

    // Добавление кнопки для обрезки
    const cropButton = document.createElement("button");
    cropButton.textContent = "Обрезать";
    cropButton.style.position = "absolute";
    cropButton.style.top = "10px";
    cropButton.style.right = "10px";
    cropButton.style.padding = "10px 20px";
    cropButton.style.backgroundColor = "#007bff";
    cropButton.style.color = "#fff";
    cropButton.style.border = "none";
    cropButton.style.cursor = "pointer";

    cropButton.addEventListener("click", cropImage);

    imageCropper.appendChild(cropButton);
});