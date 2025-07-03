let interval = null;
let startTime = 0;
let elapsed = 0;
let running = false;

const minDisplay = document.getElementById('chrono-minutes');
const secDisplay = document.getElementById('chrono-seconds');
const msDisplay = document.getElementById('chrono-ms');

function updateDisplay(time) {
  const ms = Math.floor((time % 1000) / 10);
  const sec = Math.floor((time / 1000) % 60);
  const min = Math.floor(time / 60000);
  minDisplay.textContent = min.toString().padStart(2, '0');
  secDisplay.textContent = sec.toString().padStart(2, '0');
  msDisplay.textContent = ms.toString().padStart(2, '0');
}

document.getElementById('chrono-start').onclick = function() {
  if (running) return;
  running = true;
  startTime = Date.now() - elapsed;
  interval = setInterval(() => {
    elapsed = Date.now() - startTime;
    updateDisplay(elapsed);
  }, 10);
};

document.getElementById('chrono-stop').onclick = function() {
  if (!running) return;
  running = false;
  clearInterval(interval);
};

document.getElementById('chrono-reset').onclick = function() {
  running = false;
  clearInterval(interval);
  elapsed = 0;
  updateDisplay(0);
  lapsList.innerHTML = ''; 
};

const lapButton = document.getElementById('chrono-lap');
const lapsList  = document.getElementById('laps-list');

lapButton.onclick = () => {
  if (!running && elapsed === 0) return; 
  const li = document.createElement('li');
  li.textContent = `${minDisplay.textContent}:${secDisplay.textContent}.${msDisplay.textContent}`;
  li.style.padding = '4px 0';
  lapsList.appendChild(li);
};

// Initialize display
updateDisplay(0);