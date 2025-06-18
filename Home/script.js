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

// Debug log
console.log("Script loaded, auth and db initialized.");

onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed:", user);
  const loggedInUserId = localStorage.getItem('loggedInUserId');
  
  // Debug log for local storage value
  console.log("Logged in User Id from localStorage:", loggedInUserId);
  
  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("User data:", userData);
          // Check if all required data is present
          if (userData.firstName && userData.lastName && userData.email) {
            document.getElementById('loggedUserFName').innerText = userData.firstName;
            document.getElementById('loggedUserLName').innerText = userData.lastName;
            document.getElementById('loggedUserEmail').innerText = userData.email;
          } else {
            console.warn("User data missing required fields. Hiding user info.");
            document.getElementById('user-info').style.display = "none";
          }
        } else {
          console.warn("No document found for the user id:", loggedInUserId);
          document.getElementById('user-info').style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error fetching user document:", error);
        document.getElementById('user-info').style.display = "none";
      });
  } else {
    console.warn("No logged in user id found in localStorage.");
    document.getElementById('user-info').style.display = "none";
  }
});

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
    .then(() => {
      window.location.href = '../Login and Register/index.html';
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
});

// Smooth scroll function for anchor links
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
