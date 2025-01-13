/* === Imports === */
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")
const signOutButtonEl = document.getElementById("sign-out-btn")

const userProfilePictureEl = document.getElementById("user-profile-picture")
const userGreetingEl = document.getElementById("user-greeting")
const userGreetingButtonEl = document.getElementById("greeting-btn")

const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")

const postsArea = document.getElementById("opinions-grid")
/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)
signOutButtonEl.addEventListener("click", authSignOut)
signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)
userProfilePictureEl.addEventListener("click",setProfilePicture)
userGreetingButtonEl.addEventListener("click",setUserGreeting)
postButtonEl.addEventListener("click", postButtonPressed)
/* === Main Code === */

showLoggedOutView()
showPosts()

/* === Functions === */

/* = Functions - Firebase - Authentication = */

async function showPosts(){
    const querySnapshot = await getDocs(collection(db, "Posts"));
    querySnapshot.forEach((doc) => {
    console.log(` ${doc.data().body}`);
    const data = doc.data()
    const div = document.createElement("div")
    div.className = "opinion-card"
    const name = document.createElement("p")
    name.innerText = data.poster
    name.className = "post-body-user"
    div.appendChild(name)
    const date = document.createElement("p")
    date.innerText = data.createdAt
    date.className = "post-body-data"
    div.appendChild(date)
    const post = document.createElement("p")
    date.innerText = data.body
    date.className = "post-body-post"
    div.appendChild(post)
    postsArea.appendChild(div)
  });
}

function authSignInWithGoogle() {
    console.log("Sign in with Google")
}

function authSignInWithEmail() {
    console.log("Sign in with email and password")
    const email = emailInputEl.value
    const password= passwordInputEl.value
    signInWithEmailAndPassword(auth, email, password)
  .then((_) => {
    passwordInputEl.value=""
    emailInputEl.value=""
    console.log("logged in")
  })
  .catch((error) => {
    console.log(error)
  })
}

function authCreateAccountWithEmail() {
    console.log("Sign up with email and password")
    const email = emailInputEl.value
    const password= passwordInputEl.value
    createUserWithEmailAndPassword(auth, email, password)
    .then((_) => {
      passwordInputEl.value=""
      emailInputEl.value=""
      sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log("verification")
     });
    })
    .catch((error) => {
      console.error(error.message)
    });
}

function authSignOut() {
    console.log("sign out")
    auth.signOut()
    .then((_) => {
        showLoggedOutView()
    })
    .catch((error) => {
        console.log(error)
    })
}

onAuthStateChanged(auth, (user) => {
    if (user) {
      showLoggedInView()
      showProfilePicture(userProfilePictureEl,user)
      showUserGreeting(userGreetingEl,user)
    } else {
      showLoggedOutView()
    }
  })

/* == Functions - UI Functions == */

function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
 }
 
 function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
 }
 
 
 function showView(view) {
    view.style.display = "flex"
 }
 
 
 function hideView(view) {
    view.style.display = "none"
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

function postButtonPressed() {
  const postBody = textareaEl.value
  if (postBody) {
      addPostToDB(postBody, auth.currentUser)
      clearInputField(textareaEl)
  }
}

async function addPostToDB(postBody, user) {
      try {
        const docRef = await addDoc(collection(db, "Posts"), {
          body: postBody,
          uid: user.uid,
          createdAt: serverTimestamp(),
          poster: user.displayName
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

function clearInputField(textareaEl)
{
  textareaEl.value =""
}
