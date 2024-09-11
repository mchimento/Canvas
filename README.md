# Canvas

Welcome to **canvas manipulation tool**. With simple actions such as dragging images from thumbnails, resizing them on the canvas, and selecting multiple images at once, you can easily manage and manipulate your visual elements. Below, you can find a user guide describing the different actions supported by this tool.

---

# User Guide

This guide outlines the features and functionalities of the canvas manipulation tool focusing on its key actions. All these actions are implemented using JavaScript.

## 1. Drag-and-Drop Images from Thumbnails

**Functionality**: Allows users to drag image from thumbnails menu at the top of the screen and drop them onto the canvas.

- Each thumbnail is draggable.
- The image is dropped onto the canvas, and it is positioned based on where it was dropped.

## 2. Image Selection

**Functionality**: Select images for moving or resizing.

- Clicking on an image selects it, applying a blue border to highlight the selection.
- Hold the `Shift` key to select multiple images.
- If `Shift` is held and the image is already selected, clicking on it again deselects it.
- Clicking on the canvas (background) deselects all images.

## 3. Dragging Images

**Functionality**: Move selected images across the canvas.

- Click and drag a selected image to move it.
- Multiple selected images can be dragged together.

## 4. Resizing Images

**Functionality**: Resize an individual image using a bottom-right resize handle.

- Clicking and dragging the resize handle allows you to adjust the width of the image.
- The aspect ratio of the image is maintained during resizing.
- Only one image can be resized at a time.

## 5. Deleting Images

**Functionality**: Remove selected images from the canvas using the `Delete` key.

- Press the `Delete` key to remove all selected images.
- If multiple images are selected, then all of them are removed.

## 6. Selection Box for Multiple Image Selection

**Functionality**: Create a selection box, i.e. marquee selection, to select multiple images at once.

- Click and drag on the canvas (excluding images) to create a selection box.
- The selection box allows you to select all images that are fully within its boundaries.
- After selection, images can be manipulated like individually selected images.