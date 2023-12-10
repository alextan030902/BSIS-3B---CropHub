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


const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const firstnameError = document.getElementById("firstnameError");
  const lastnameError = document.getElementById("lastnameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  const errors = {};

  if (!firstname) {
    firstnameError.classList.remove("d-none");
    firstnameError.textContent = "Please enter your firstname.";
    errors.firstname = "Please enter your firstname.";
  } else {
    firstnameError.classList.add("d-none");
    firstnameError.textContent = "";
  }

  if (!lastname) {
    lastnameError.classList.remove("d-none");
    lastnameError.textContent = "Please enter your lastname.";
    errors.lastname = "Please enter your lastname.";
  } else {
    lastnameError.classList.add("d-none");
    lastnameError.textContent = "";
  }

  if (!email) {
    emailError.classList.remove("d-none");
    emailError.textContent = "Please enter an email address.";
    errors.email = "Please enter an email address.";
  } else if (checkEmailExistence(email) === true) {
    emailError.classList.remove("d-none");
    emailError.textContent = "Email address already exists.";
    errors.email = "Email address already exists.";
  } else {
    emailError.classList.add("d-none");
    emailError.textContent = "";
  }

  if (!password) {
    passwordError.classList.remove("d-none");
    passwordError.textContent = "Please enter a password.";
    errors.password = "Please enter a password.";
  } else if (password.length < 6) {
    passwordError.classList.remove("d-none");
    passwordError.textContent = "Password must be at least 6 characters long.";
    errors.password = "Password must be at least 6 characters long.";
  } else {
    passwordError.classList.add("d-none");
    passwordError.textContent = "";
  }

  if (!confirmPassword) {
    confirmPasswordError.classList.remove("d-none");
    confirmPasswordError.textContent = "Please enter your confirm password.";
    errors.confirmPassword = "Please enter your confirm password.";
  } else if (confirmPassword !== password) {
    confirmPasswordError.classList.remove("d-none");
    confirmPasswordError.textContent = "Passwords do not match.";
    errors.confirmPassword = "Passwords do not match.";
  } else {
    confirmPasswordError.classList.add("d-none");
    confirmPasswordError.textContent = "";
  }

  const hasErrors = Object.values(errors).some((error) => error !== "");

  if (hasErrors) {
    return; 
  }

  const db = getDatabase();

  const userId = Math.random().toString(36).substr(2, 9);

  const user = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    userId: userId,
  };

  let registrationSuccess = true;

  set(ref(db, "users/" + userId), user)
    .then(() => {
      console.log("User successfully registered");

      signupForm.reset();
    })
    .catch((error) => {
      console.error(
        "Error creating user in Firebase Realtime Database:",
        error
      );
      registrationSuccess = false;
    })
    .finally(() => {
      if (registrationSuccess) {
        window.location.href = "login.html";
      }
    });
});



function checkEmailExistence(email) {
  const db = getDatabase();
  const usersRef = ref(db, "users");

  let emailExists = false;

  onValue(usersRef, (snapshot) => {
    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const userId = userSnapshot.key;
      const emailAddress = userData.email;

      if (emailAddress === email) {
        emailExists = true;
        return; 
      }
    });
  });

  return emailExists;
}
checkEmailExistence(email);

