const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

const initialWorkTime = 25 * 60;
let currentTime = initialWorkTime;
let timerInterval = null;
let isPaused = true;

function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;

    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
    if (isPaused) {
        isPaused = false;
        startButton.disabled = true;
        pauseButton.disabled = false;

        timerInterval = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                alert("Pomodoro session finished! Time for a break.");
                resetTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (!isPaused) {
        isPaused = true;
        clearInterval(timerInterval);
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isPaused = true;
    currentTime = initialWorkTime;
    updateDisplay();

    startButton.disabled = false;
    pauseButton.disabled = true;
}

startButton.addEventListener('click', startTimer);

pauseButton.addEventListener('click', pauseTimer);

resetButton.addEventListener('click', resetTimer);

window.onload = () => {
    updateDisplay();
    pauseButton.disabled = true;
};