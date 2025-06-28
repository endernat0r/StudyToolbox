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
const soundFiles = {
  rain: 'soft-rain-ambient-111154.mp3',
  forest: 'ambient-spring-forest-323801.mp3',
  waves: 'ambient-forest-bird-sounds-280152.mp3',
  cafe: 'ambient-sound-inside-cafeteria-18255.mp3'
};

const sounds = {};
for (let key in soundFiles) {
  const audio = new Audio(soundFiles[key]);
  audio.loop = true;
  audio.volume = 0.5;
  sounds[key] = audio;
}

const cap = str => str.charAt(0).toUpperCase() + str.slice(1);

document.querySelectorAll('.sound-card').forEach(card => {
  const key = card.dataset.sound;
  const btn = card.querySelector('.play-btn');
  const slider = card.querySelector('.volume-slider');
  const audio = sounds[key];

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = `Stop ${cap(key)}`;
      btn.classList.add('active');
    } else {
      audio.pause();
      btn.textContent = cap(key);
      btn.classList.remove('active');
    }
  });

  slider.addEventListener('input', () => {
    audio.volume = slider.value;
  });
});