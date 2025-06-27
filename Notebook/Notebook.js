import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


const STORAGE_KEY = 'notes';

document.addEventListener('DOMContentLoaded', displayNotes);
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
function popup() {
    const wrapper = document.createElement('div');
    wrapper.id = 'popupContainer';
    wrapper.innerHTML = `
    <h1>New Note</h1>
    <div class="input-group">
        <input type="text" id="note-title" placeholder="Enter title...">
    </div>
    <textarea id="note-text" placeholder="Enter your note..."></textarea>
    <div id="btn-container">
       <button id="submitBtn">Create</button>
       <button id="closeBtn">Close</button>
    </div>`;
    document.body.appendChild(wrapper);

    wrapper.querySelector('#submitBtn').onclick = createNote;
    wrapper.querySelector('#closeBtn').onclick = () => wrapper.remove();
}

function createNote() {
    const title = document.getElementById('note-title').value.trim();
    const text = document.getElementById('note-text').value.trim();
    if (!text) return;

    const notes = getNotes();
    notes.push({ id: Date.now(), title, text });
    saveNotes(notes);

    document.getElementById('popupContainer').remove();
    displayNotes();
}

function displayNotes() {
    const ul = document.getElementById('notes-list');
    ul.innerHTML = '';

    getNotes().forEach(({ id, title, text }) => {
        const li = document.createElement('li');
        li.innerHTML = `
      <h2>${title || 'Untitled'}</h2>
      <p>${text}</p>
      <div class="btn-group">
         <button class="edit-btn"><i class="fa-solid fa-pen"></i>Edit</button>
         <button class="delete-btn"><i class="fa-solid fa-trash"></i>Delete</button>
      </div>`;
        li.querySelector('.edit-btn').onclick = () => editNote(id);
        li.querySelector('.delete-btn').onclick = () => deleteNote(id);

        ul.appendChild(li);
    });
}

function deleteNote(id) {
    const notes = getNotes().filter(n => n.id !== id);
    saveNotes(notes);
    displayNotes();
}

function editNote(id) {
    const note = getNotes().find(n => n.id === id);
    if (!note) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'editing-container';
    wrapper.dataset.id = id;
    wrapper.innerHTML = `
    <h1>Edit Note</h1>
    <div class="input-group">
        <input type="text" id="edit-title" value="${note.title}" placeholder="Enter title...">
    </div>
    <textarea id="edit-text">${note.text}</textarea>
    <div id="btn-container">
      <button id="submitBtn">Done</button>
      <button id="closeBtn">Cancel</button>
    </div>`;
    document.body.appendChild(wrapper);

    wrapper.querySelector('#submitBtn').onclick = updateNote;
    wrapper.querySelector('#closeBtn').onclick = () => wrapper.remove();
}

function updateNote() {ssw
    const wrapper = document.getElementById('editing-container');
    const id = Number(wrapper.dataset.id);
    const title = document.getElementById('edit-title').value.trim();
    const text = document.getElementById('edit-text').value.trim();
    if (!text) return;

    const notes = getNotes().map(n => n.id === id ? { ...n, title, text } : n);
    saveNotes(notes);

    wrapper.remove();
    displayNotes();
}

function getNotes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
function saveNotes(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}