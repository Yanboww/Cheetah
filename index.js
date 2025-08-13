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
  apiKey: /*api key*/,
  authDomain: /*auth*/,
  projectId: /*projectId*/,
  storageBucket: /*storage-bucket*/,
  messagingSenderId: /*id*/,
  appId: /*ap-id*/
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
/* === UI === */
let mood = "assets/images/grin.png"
let question = ""
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

const smile = document.getElementById("smile-btn")
const neutral = document.getElementById("neutral-btn")
const sad = document.getElementById("sad-btn")
const joy = document.getElementById("joy-btn")
const mad = document.getElementById("mad-btn")
const annoyed = document.getElementById("annoyed-btn")

const goGeneral = document.getElementById("general-btn")
/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)
signOutButtonEl.addEventListener("click", authSignOut)
signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)
userProfilePictureEl.addEventListener("click",setProfilePicture)
userGreetingButtonEl.addEventListener("click",setUserGreeting)
postButtonEl.addEventListener("click", postButtonPressed)
smile.addEventListener("click", smileButtonPressed)
sad.addEventListener("click", sadButtonPressed)
neutral.addEventListener("click", neutralButtonPressed)
joy.addEventListener("click", joyButtonPressed)
mad.addEventListener("click", madButtonPressed)
annoyed.addEventListener("click", annoyedButtonPressed)

goGeneral.addEventListener("click",goToGeneralPage)
/* === Main Code === */

showLoggedOutView()
showPosts()

/* === Functions === */
function goToGeneralPage(){
  location.href="post.html"
  localStorage.setItem("auth",auth)
  localStorage.setItem("auth",app)
  localStorage.setItem("db",db)
}

async function getQuestions(){
  let questionArr = []
  const response = await fetch("assets/questions.txt")
  if(response.status == 200)
  {
    let text = await response.text()
    questionArr = text.split("\n")
    question = questionArr[Math.floor(Math.random() * 4)]
  }
  console.log(question)
  textareaEl.placeholder = question
}
function smileButtonPressed(){
  mood = "assets/images/grin.png"
}
function sadButtonPressed(){
  mood = "assets/images/cry.png"
}
function neutralButtonPressed(){
  mood = "assets/images/neutral_face.png"
}
function joyButtonPressed() {
  mood = "assets/images/joy.png";
}
function madButtonPressed() {
  mood = "assets/images/mad.png";
}
function annoyedButtonPressed() {
  mood = "assets/images/annoyed.png";
}
/* = Functions - Firebase - Authentication = */

async function showPosts(){
    postsArea.innerHTML =""
    await getQuestions()
    const querySnapshot = await getDocs(collection(db, question));
    querySnapshot.forEach((doc) => {
    console.log(` ${doc.data().body}`);
    const data = doc.data()
    const div = document.createElement("div")
    div.className = "opinion-card"
    const moodPost = document.createElement("img")
    moodPost.src = data.emoji
    moodPost.className = "post-body-mood"
    div.appendChild(moodPost)
    const name = document.createElement("p")
    name.innerText = data.poster
    name.className = "post-body-user"
    div.appendChild(name)
    const date = document.createElement("p")
    date.innerText = data.createdAt.toDate().toDateString()
    console.log(date)
    date.className = "post-body-date"
    div.appendChild(date)
    console.log(data.createdAt.toDate().toDateString())
    const post = document.createElement("p")
    post.innerText = data.body
    post.className = "post-body-post"
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
        const docRef = await addDoc(collection(db, question), {
          body: postBody,
          uid: user.uid,
          createdAt: serverTimestamp(),
          poster: user.displayName,
          emoji: mood
        });
        const div = document.createElement("div")
        div.className = "opinion-card"
        const moodPost = document.createElement("img")
        moodPost.src = mood
        moodPost.className = "post-body-mood"
        div.appendChild(moodPost)
        const name = document.createElement("p")
        name.innerText = user.displayName
        name.className = "post-body-user"
        div.appendChild(name)
        const date = document.createElement("p")
        date.innerText = new Date().toDateString();
        date.className = "post-body-date"
        div.appendChild(date)
        const post = document.createElement("p")
        post.innerText = postBody 
        post.className = "post-body-post"
        div.appendChild(post)
        postsArea.appendChild(div)
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

document.addEventListener("DOMContentLoaded", function() {
  const smileBtn = document.getElementById("smile-btn");
  const neutralBtn = document.getElementById("neutral-btn");
  const sadBtn = document.getElementById("sad-btn");

  function removeClickedClass() {
      smileBtn.classList.remove("clicked");
      neutralBtn.classList.remove("clicked");
      sadBtn.classList.remove("clicked");
  }

  smileBtn.addEventListener("click", function() {
      removeClickedClass();
      smileBtn.classList.add("clicked");
  });

  neutralBtn.addEventListener("click", function() {
      removeClickedClass();
      neutralBtn.classList.add("clicked");
  });

  sadBtn.addEventListener("click", function() {
      removeClickedClass();
      sadBtn.classList.add("clicked");
  });
});


function clearInputField(textareaEl)
{
  textareaEl.value =""

}
