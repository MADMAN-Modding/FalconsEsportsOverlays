let draw;

function makeDraggable(element) {
    element.draggable().on('dragend', () => {
        console.log('Moved to:', element.x(), element.y());
    });
}

function addText() {
    const text = draw.text('Editable Text').move(100, 100).fill('#000').font({ size: 24 });
    makeDraggable(text);

    text.on('dblclick', () => {
        const newText = prompt("Edit text:", text.text());
        if (newText !== null) text.text(newText);
    });

    text.on('click', () => {
        const color = document.getElementById('colorPicker')?.value || '#000';
        text.fill(color);
    });
}

function addRect() {
    const rect = draw.rect(150, 100).move(200, 200).fill('#ccc');
    makeDraggable(rect);

    rect.on('click', () => {
        const color = document.getElementById('colorPicker')?.value || '#ccc';
        rect.fill(color);
    });
}

function exportSVG() {
    const svgMarkup = draw.svg();
    console.log(svgMarkup);
    alert("SVG copied to console! You can now save or embed it.");
}

function setupEditor() {
    draw = SVG().addTo('#svgCanvas').size('100%', '100%');

    // Expose the functions globally
    window.addText = addText;
    window.addRect = addRect;
    window.exportSVG = exportSVG;
};
