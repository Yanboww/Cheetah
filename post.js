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

let mood = "assets/images/grin.png"


userProfilePictureEl.addEventListener("click",setProfilePicture)
userGreetingButtonEl.addEventListener("click",setUserGreeting)

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user)
    const uid = user.uid;
    showLoggedInView()
    showProfilePicture(userProfilePictureEl,user)
    showUserGreeting(userGreetingEl,user)
    showPosts()
  } else {
    console.log("not logged in")
  }
});



async function showPosts(){
  postsArea.innerHTML =""
  const querySnapshot = await getDocs(collection(db, "Posts"));
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
postButtonEl.addEventListener("click", postButtonPressed)

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

smile.addEventListener("click", smileButtonPressed)
sad.addEventListener("click", sadButtonPressed)
neutral.addEventListener("click", neutralButtonPressed)  

function smileButtonPressed(){
  mood = "assets/images/grin.png"
}
function sadButtonPressed(){
  mood = "assets/images/cry.png"
}
function neutralButtonPressed(){
  mood = "assets/images/neutral_face.png"
}

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
