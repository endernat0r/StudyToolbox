
document.addEventListener('DOMContentLoaded', () => {
  const canvas     = document.getElementById('whiteboard');
  const ctx        = canvas.getContext('2d');
  const colorPicker= document.getElementById('colorPicker');
  const sizeRange  = document.getElementById('brushSize');
  const clearBtn   = document.getElementById('clearBtn');
  const saveBtn    = document.getElementById('saveBtn');

  // resize canvas to its CSS size
  function resize() {
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let drawing = false;

  canvas.addEventListener('pointerdown', e => {
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth   = sizeRange.value;
    ctx.lineCap     = 'round';
    drawing = true;
  });

  canvas.addEventListener('pointermove', e => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  canvas.addEventListener('pointerup',   () => drawing = false);
  canvas.addEventListener('pointerleave',() => drawing = false);

  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `sketch-${Date.now()}.png`;
    link.href     = canvas.toDataURL('image/png');
    link.click();
  });
});

const canvas = document.getElementById('whiteboard');
if (!canvas) {
  console.error("No <canvas id='whiteboard'> found");
  throw new Error("Canvas missing");
}
const ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let painting = false;
let brushColor = '#000000';
let brushSize = 5;
let isErasing = false;

function startPainting(e) {
    painting = true;
    draw(e);
}

function stopPainting() {
    painting = false;
    ctx.beginPath();  
}

function draw(e) {
    if (!painting) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isErasing ? '#ffffff' : brushColor;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

document.getElementById('penButton').addEventListener('click', () => {
    isErasing = false;
});

document.getElementById('eraserButton').addEventListener('click', () => {
    isErasing = true;
});

document.getElementById('colorPicker').addEventListener('input', (e) => {
    brushColor = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

document.getElementById('clearButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', () => {
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});