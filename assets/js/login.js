// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQSCj2eOEIxGSVfRtbCMIQKzqORsZ-dks",
  authDomain: "newproject-db3b1.firebaseapp.com",
  databaseURL: "https://newproject-db3b1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "newproject-db3b1",
  storageBucket: "newproject-db3b1.appspot.com",
  messagingSenderId: "436296489551",
  appId: "1:436296489551:web:e22f77e5080ca9ec37a83a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event)=> {
  event.preventDefault(); // Prevent the default form submission



  const email = document.getElementById("email").value;
  const password = document.getElementById("loginPassword").value;

  const db = getDatabase();
  const usersRef = ref(db, "users");

  let userID = "";
  let userFound = false;

  onValue(usersRef, (snapshot) => {
    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const userId = userSnapshot.key;
      const emailAddress = userData.email;
      const passwordData = userData.password;

      // console.log(emailAddress, passwordData);

      if (emailAddress === email && passwordData === password) {
        userFound = true;
        userID = userId;
        console.log("User successfully signed in:", userID);

        localStorage.setItem("userId", userId);
        localStorage.setItem("userEmail", emailAddress);
        localStorage.setItem("userFirstname", userData.firstname);
        localStorage.setItem("userLastname", userData.lastname);

        const toast = new bootstrap.Toast(
          document.getElementById("signinSuccessToast")
        );
        toast.show();

        setTimeout(() => {
          toast.hide();
          window.location.href = "index.html";
        }, 1000);

        return; // Exit the loop if a user is found
      }
    });

    if (!userFound) {
      // Handle case where user is not found or credentials are incorrect
      console.log("Invalid credentials");
      // Display an error message or handle it accordingly
    }
  });
});