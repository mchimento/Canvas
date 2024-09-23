const thumbnails = document.querySelectorAll('.thumbnail img');
const canvas = document.getElementById('canvas');
let selectedImages = [];
let isResizing = false;
let isDragging = false;
let isSelecting = false;
let offsetX = 0;
let offsetY = 0;
let dragOffsets = [];
let selectionBox = null;
let startX = 0;
let startY = 0;

// Thumbnail drag start
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('imageSrc', e.target.src);
    });
});

// Handle drop on canvas from thumbnails menu
canvas.addEventListener('dragover', function(e) {
    e.preventDefault();
});

canvas.addEventListener('drop', function(e) {
    e.preventDefault();
    const imageSrc = e.dataTransfer.getData('imageSrc');
    if (imageSrc) {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('draggable');
        imgContainer.style.width = '100px';
        imgContainer.style.height = 'auto';
        imgContainer.style.position = 'absolute';
        imgContainer.style.top = `${e.offsetY}px`;
        imgContainer.style.left = `${e.offsetX}px`;

        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.setAttribute('draggable', 'false');

        imgContainer.appendChild(img);

        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resize-handle');
        imgContainer.appendChild(resizeHandle);

        canvas.appendChild(imgContainer);

        // Automatically select the newly dropped image
        selectDroppedImage(imgContainer);

        // Add event listeners for selection, resizing, and dragging
        imgContainer.addEventListener('click', selectImage);
        imgContainer.addEventListener('mousedown', startDragging);
        resizeHandle.addEventListener('mousedown', startResizing);
    }
    });

// Function to select newly dropped images
function selectDroppedImage(imgContainer) {
    deselectAllImages();
    imgContainer.classList.add('selected');
    selectedImages.push(imgContainer);
}

// Select image(s) and apply blue highlight
function selectImage(e) {
    e.stopPropagation();

    if (e.shiftKey) {
        //If shift is press, then keep selecting images
        if (selectedImages.includes(e.currentTarget)) {
            // Deselect if already selected
            e.currentTarget.classList.remove('selected');
            selectedImages = selectedImages.filter(img => img !== e.currentTarget);
        } else {
            // Add to selection
            selectedImages.push(e.currentTarget);
            e.currentTarget.classList.add('selected');
        }
    } else {
        // Deselect all other images if shift is not pressed
        if (selectedImages.length <= 1) {      
            deselectAllImages();
            selectedImages = [e.currentTarget];
            e.currentTarget.classList.add('selected');
        } else {
            
        }
    }
}

// Deselect images when clicking on the background (canvas)
canvas.addEventListener('click', function() {
    deselectAllImages();
});

function deselectAllImages() {
    selectedImages.forEach(img => img.classList.remove('selected'));
    selectedImages = [];
}

// Dragging the images
function startDragging(e) {
    if (e.target.classList.contains('resize-handle')) return;
    isDragging = true;

    dragOffsets = selectedImages.map(img => {
        return {
            img,
            offsetX: e.clientX - img.offsetLeft,
            offsetY: e.clientY - img.offsetTop
        };
    });

    document.addEventListener('mousemove', dragImages);
    document.addEventListener('mouseup', stopDragging);
}

function dragImages(e) {
    if (isDragging) {
        dragOffsets.forEach(({ img, offsetX, offsetY }) => {
            img.style.left = `${e.clientX - offsetX}px`;
            img.style.top = `${e.clientY - offsetY}px`;
        });
    }
}

function stopDragging() {
    isDragging = false;
    document.removeEventListener('mousemove', dragImages);
    document.removeEventListener('mouseup', stopDragging);
}

// Resizing the image using the bottom-right corner
function startResizing(e) {
    e.stopPropagation();
    isResizing = true;
    document.addEventListener('mousemove', resizeImage);
    document.addEventListener('mouseup', stopResizing);
}

function resizeImage(e) {
    if (isResizing && selectedImages.length === 1) {
        const selectedImage = selectedImages[0];
        const rect = selectedImage.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        selectedImage.style.width = `${newWidth}px`;
    }
}

function stopResizing() {
    isResizing = false;
    document.removeEventListener('mousemove', resizeImage);
}

// Delete selected images
window.addEventListener('keydown', function(e) {
    if (selectedImages.length > 0 && e.key === 'Delete') {
        selectedImages.forEach(img => img.remove());
        selectedImages = [];
    }
});

// Start selection box
canvas.addEventListener('mousedown', function(e) {
    if (e.target === canvas) {
        startX = e.offsetX;
        startY = e.offsetY;
        isSelecting = true;

        // Create selection box
        selectionBox = document.createElement('div');
        selectionBox.style.position = 'absolute';
        selectionBox.style.border = '1px dashed #000';
        selectionBox.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
        selectionBox.style.pointerEvents = 'none'; // Ensure it doesn't interfere with interaction
        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        canvas.appendChild(selectionBox);

        document.addEventListener('mousemove', resizeSelectionBox);
        document.addEventListener('mouseup', stopSelection);
    }
});

// Resize selection box
function resizeSelectionBox(e) {
    if (isSelecting) {
        const canvasRect = canvas.getBoundingClientRect();
        const currentX = e.clientX - canvasRect.left;
        const currentY = e.clientY - canvasRect.top;

        selectionBox.style.width = `${Math.abs(currentX - startX)}px`;
        selectionBox.style.height = `${Math.abs(currentY - startY)}px`;
        selectionBox.style.left = `${Math.min(currentX, startX)}px`;
        selectionBox.style.top = `${Math.min(currentY, startY)}px`;
    }
}

// Stop selection and select images within the selection box
function stopSelection(e) {
    isSelecting = false;
    document.removeEventListener('mousemove', resizeSelectionBox);
    document.removeEventListener('mouseup', stopSelection);
    
    const boxRect = selectionBox.getBoundingClientRect();
    const images = canvas.querySelectorAll('.draggable');
    deselectAllImages();

    images.forEach(img => {
        const imgRect = img.getBoundingClientRect();
        if (boxRect.right > imgRect.left &&
            boxRect.top < imgRect.bottom &&
            boxRect.left < imgRect.right &&
            boxRect.bottom > imgRect.top) {
            selectedImages.push(img);
            img.classList.add('selected');
        } 
    });

    // Remove the selection box from the canvas
    canvas.removeChild(selectionBox);
    selectionBox = null;
}