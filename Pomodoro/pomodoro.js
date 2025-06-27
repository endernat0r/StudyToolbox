import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYvI-8iRuC_zUGXkwIQgGlwJIUPkm8oS8",
  authDomain: "login-form-f6611.firebaseapp.com",
  projectId: "login-form-f6611",
  storageBucket: "login-form-f6611.firebasestorage.app",
  messagingSenderId: "745520618437",
  appId: "1:745520618437:web:0146b2381393778e1309ac"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const authContainer = document.querySelector('.auth-container');

function renderLoggedInState(userData) {
  authContainer.innerHTML = `
    <a class="signup" id="profileBtn" href="#">Profile</a>
    <a class="signup" id="authAction" href="#">Logout</a>
  `;

  const authAction = document.getElementById('authAction');
  authAction.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
      .then(() => {
        window.location.href = "main.html"; 
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  });
  
  const profileBtn = document.getElementById('profileBtn');
  profileBtn.addEventListener('click', () => {
    document.getElementById('profileModal').style.display = "block";
  });
  
  if (userData) {
    document.getElementById('profileNickname').innerText = userData.nickname;
    document.getElementById('profileFName').innerText = userData.firstName;
    document.getElementById('profileLName').innerText = userData.lastName;
    document.getElementById('profileEmail').innerText = userData.email;
  }
}

function renderLoggedOutState() {
  authContainer.innerHTML = `<a class="signup" id="authAction" href="../Login and Register/index.html">Sign-up & Sign-In</a>`;
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
      const docRef = doc(db, "users", loggedInUserId);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.firstName && userData.lastName && userData.email && userData.nickname) {
              renderLoggedInState(userData);
            } else {
              console.warn("User data missing required fields.");
              renderLoggedInState(null);
            }
          } else {
            console.warn("No document found for user id:", loggedInUserId);
            renderLoggedInState(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching user document:", error);
          renderLoggedInState(null);
        });
    } else {
      renderLoggedOutState();
    }
  } else {
    renderLoggedOutState();
  }
});

const modalClose = document.querySelector('.modal .close');
modalClose.addEventListener('click', () => {
  document.getElementById('profileModal').style.display = "none";
});
window.addEventListener('click', (event) => {
  if (event.target == document.getElementById('profileModal')) {
    document.getElementById('profileModal').style.display = "none";
  }
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const switchButton = document.getElementById('switch');
const presetSelect = document.getElementById('preset');
const customWorkInput = document.getElementById('custom-work');
const customBreakInput = document.getElementById('custom-break');
const setCustomButton = document.getElementById('set-custom');
const toggleCustomButton = document.getElementById('toggle-custom');
const customControls = document.querySelector('.custom-controls');
const cycleCountDisplay = document.getElementById('cycle-count');

let work, breakTime;
[work, breakTime] = presetSelect.value.split('-').map(Number);
let initialWorkTime = work * 60;
let initialBreakTime = breakTime * 60;

let isWorkSession = true;
let currentTime = initialWorkTime;
let timerInterval = null;
let isPaused = true;
let cycleCount = 0;

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
          onSessionEnd("Work session finished! Time for a break.", switchToBreak);
        } else {
          onSessionEnd("Break finished! Back to work.", switchToWork);
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
  if (isWorkSession) switchToBreak(); else switchToWork();
}

function onSessionEnd(message, nextFn) {
  beep();
  alert(message);
  nextFn();
  if (!isWorkSession) { 
    cycleCount++;
    cycleCountDisplay.textContent = `Cycles Completed: ${cycleCount}`;
  }
}

function beep(duration = 200, freq = 600) {
  const ctx = new (window.AudioContext||window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  osc.connect(ctx.destination);
  osc.start();
  setTimeout(()=>osc.stop(), duration);
}

presetSelect.addEventListener('change', () => {
  pauseTimer();
  [work, breakTime] = presetSelect.value.split('-').map(Number);
  initialWorkTime = work * 60;
  initialBreakTime = breakTime * 60;
  currentTime = isWorkSession ? initialWorkTime : initialBreakTime;
  updateDisplay();
});

toggleCustomButton.addEventListener('click', () => {
  if (customControls.style.display === "none" || customControls.style.display === "") {
    customControls.style.display = "block";
    toggleCustomButton.textContent = "Done";
  } else {

    const customWork = Number(document.getElementById('custom-work').value) || work;
    const customBreak = Number(document.getElementById('custom-break').value) || breakTime;
    initialWorkTime = customWork * 60;
    initialBreakTime = customBreak * 60;
    currentTime = isWorkSession ? initialWorkTime : initialBreakTime;
    updateDisplay();
    customControls.style.display = "none";
    toggleCustomButton.textContent = "Set Custom";
  }
});

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
switchButton.addEventListener('click', toggleSession);

window.onload = () => {
  updateDisplay();
};