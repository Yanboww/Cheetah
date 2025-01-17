import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import { updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import {  getDocs  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
/* === Firebase Setup === */
const firebaseConfig = {
    apiKey: "AIzaSyBJJO_cRmJOyTBLu5xVja7ZiAc79BuQ6_4",
    authDomain: "cheetah-5a6ca.firebaseapp.com",
    projectId: "cheetah-5a6ca",
    storageBucket: "cheetah-5a6ca.firebasestorage.app",
    messagingSenderId: "82862862686",
    appId: "1:82862862686:web:96de9051ca3a6bf42f1fcf"
};
const app = localStorage.getItem("app");
const auth = localStorage.getItem("auth")
const db = localStorage.getItem("db");
const viewLoggedIn = document.getElementById("logged-in-view")
const userProfilePictureEl = document.getElementById("user-profile-picture")
const userGreetingEl = document.getElementById("user-greeting")
const userGreetingButtonEl = document.getElementById("greeting-btn")

const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")

const postsArea = document.getElementById("opinions-grid")

const smile = document.getElementById("smile-btn")
const neutral = document.getElementById("neutral-btn")
const sad = document.getElementById("sad-btn")

showLoggedInView()
showProfilePicture(userProfilePictureEl,auth.currentUser)
showUserGreeting(userGreetingEl,auth.currentUser)

const back = document.getElementById("back-btn")
back.addEventListener("click",goMain)

function goMain()
{
    location.href = "index.html"
}

function showLoggedInView() {
    showView(viewLoggedIn)
 }

 function showView(view) {
    view.style.display = "flex"
 }
 
 function showProfilePicture(userProfilePictureEl, user){
    if (user !== null) {
      let photoURL = user.photoURL;
      if(photoURL == null) photoURL = "assets/images/defaultPic.jpg"
      userProfilePictureEl.src = photoURL
    }
 }

 function setProfilePicture()
 {
    const url = prompt("Enter Picture URL")
    const user = auth.currentUser
    updateProfile(user, {
      photoURL: url
    }).then(() => {
      console.log("updated")
    }).catch((error) => {
      console.log(error)
    });
    userProfilePictureEl.src = url
 }

 function showUserGreeting(userGreetingEl, user){
  if (user !== null) {
    let greeting = "Hi " + user.displayName;
    if(user.displayName == null)
    {
        greeting = "Please set greeting"
        const user = auth.currentUser
        updateProfile(user, {
        displayName: user.uid
        }).then(() => {
          console.log("updated")
        }).catch((error) => {
          console.log(error)
        });
    }
    userGreetingEl.innerText = greeting
  }
}
 
function setUserGreeting(){
    const greeting = prompt("Enter Greeting")
    const user = auth.currentUser
    updateProfile(user, {
      displayName: greeting
    }).then(() => {
      console.log("updated")
    }).catch((error) => {
      console.log(error)
    });
    userGreetingEl.innerText = "Hi " + greeting
}
