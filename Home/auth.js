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

function renderLoggedOutState() {
  window.location.href = "main.html";
}
function setupAuth(authContainerSelector, redirectIfNotLoggedIn = true, logoutRedirectUrl = "main.html", signInPageUrl = "../Login and Register/index.html") {
  const authContainer = document.querySelector(authContainerSelector);
  if (!authContainer) {
    console.error("Auth container not found:", authContainerSelector);
    return;
  }

  // Render the logged‐in state: show Profile and Logout buttons.
  function renderLoggedInState() {
    authContainer.innerHTML = `
      <a class="signup" id="profileBtn" href="#">Profile</a>
      <a class="signup" id="logoutBtn" href="#">Logout</a>
    `;

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('loggedInUserId');
      signOut(auth)
        .then(() => {
          window.location.href = logoutRedirectUrl;
        })
        .catch(error => {
          console.error("Error signing out:", error);
        });
    });

    document.getElementById('profileBtn').addEventListener('click', () => {
      const profileModal = document.getElementById('profileModal');
      if (profileModal) {
        profileModal.style.display = "block";
      } else {
        alert("Profile modal not available on this page.");
      }
    });
  }

  // Render the logged‐out state: show Sign-up & Sign-In and (optionally) redirect.
  function renderLoggedOutState() {
    authContainer.innerHTML = `<a class="signup" id="authAction" href="${signInPageUrl}">Sign-up & Sign-In</a>`;
    if (redirectIfNotLoggedIn) {
      window.location.href = signInPageUrl;
    }
  }

  onAuthStateChanged(auth, (user) => {
    const storedUid = localStorage.getItem('loggedInUserId');
    if (user && storedUid && user.uid === storedUid) {
      // Verify that the user document exists in Firestore.
      getDoc(doc(db, "users", storedUid))
        .then(docSnap => {
          if (docSnap.exists()) {
            renderLoggedInState();
          } else {
            renderLoggedOutState();
          }
        })
        .catch(error => {
          console.error("Error fetching user document:", error);
          renderLoggedOutState();
        });
    } else {
      renderLoggedOutState();
    }
  });
}

export { auth, db, setupAuth };