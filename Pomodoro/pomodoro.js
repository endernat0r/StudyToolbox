const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const switchButton = document.getElementById('switch');
const presetSelect = document.getElementById('preset');

let work, breakTime;
if (presetSelect) {
    [work, breakTime] = presetSelect.value.split('-').map(Number);
} else {
    work = 25;
    breakTime = 5;
}
let initialWorkTime = work * 60;
let initialBreakTime = breakTime * 60;

let isWorkSession = true;
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
                if (isWorkSession) {
                    alert("Work session finished! Time for a break.");
                    switchToBreak();
                } else {
                    alert("Break finished! Back to work.");
                    switchToWork();
                }
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
    currentTime = isWorkSession ? initialWorkTime : initialBreakTime;
    updateDisplay();
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function switchToBreak() {
    isWorkSession = false;
    currentTime = initialBreakTime;
    updateDisplay();
    switchButton.textContent = "Work";
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function switchToWork() {
    isWorkSession = true;
    currentTime = initialWorkTime;
    updateDisplay();
    switchButton.textContent = "Break";
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function toggleSession() {
    pauseTimer();
    if (isWorkSession) {
        switchToBreak();
    } else {
        switchToWork();
    }
}

if (presetSelect) {
    presetSelect.addEventListener('change', () => {
        pauseTimer();
        const [w, b] = presetSelect.value.split('-').map(Number);
        initialWorkTime = w * 60;
        initialBreakTime = b * 60;
        currentTime = isWorkSession ? initialWorkTime : initialBreakTime;
        updateDisplay();
    });
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
switchButton.addEventListener('click', toggleSession);

window.onload = () => {
    updateDisplay();
    pauseButton.disabled = true;
    switchButton.textContent = "Break";
};