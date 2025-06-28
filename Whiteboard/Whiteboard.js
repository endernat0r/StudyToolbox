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
})
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