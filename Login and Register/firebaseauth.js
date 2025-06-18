// Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"
 
  const firebaseConfig = {
    apiKey: "AIzaSyDYvI-8iRuC_zUGXkwIQgGlwJIUPkm8oS8",
    authDomain: "login-form-f6611.firebaseapp.com",
    projectId: "login-form-f6611",
    storageBucket: "login-form-f6611.firebasestorage.app",
    messagingSenderId: "745520618437",
    appId: "1:745520618437:web:0146b2381393778e1309ac"
  };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }
 const signUp=document.getElementById('submitSignUp');
 signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName:lastName
        };
        showMessage('Account Created Successfully', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='index.html';
        })
        .catch((error)=>{
            console.error("error writing document", error);

        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        }
        else{
            showMessage('unable to create User', 'signUpMessage');
        }
    })
 });

 const signIn=document.getElementById('submitSignIn');
 signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    showMessage('Login is successful', 'signInMessage');
    const user = userCredential.user;
    localStorage.setItem('loggedInUserId', user.uid);
    window.location.href='../Home/main.html';
  })
  .catch((error) => {
    console.error("Sign in error:", error.code, error.message);
    const errorCode = error.code;
    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
      showMessage('Incorrect Email or Password', 'signInMessage');
    } else {
      showMessage('Unable to sign in', 'signInMessage');
    }
  });
 })