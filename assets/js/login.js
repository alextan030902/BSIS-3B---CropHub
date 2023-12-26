// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

// Add this code after initializing Firebase and before setting up the loginForm event listener

const createDefaultAdmin = () => {
  const db = getDatabase();
  const usersRef = ref(db, "users");

  const defaultAdmin = {
    email: "admin@example.com",
    password: "adminpassword",
    isAdmin: true,
    firstname: "Admin",
    lastname: "User"
  };

  // Check if the default admin already exists
  onValue(usersRef, (snapshot) => {
    let adminExists = false;

    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const emailAddress = userData.email;

      if (emailAddress === defaultAdmin.email) {
        adminExists = true;
      }
    });

    if (!adminExists) {
      // Create the default admin user
      const newAdminRef = push(usersRef);
      set(newAdminRef, defaultAdmin);
      console.log("Default admin account created.");
    } else {
      console.log("Default admin account already exists.");
    }
  });
};

// Call the function to create the default admin account
createDefaultAdmin();

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission

  const email = document.getElementById("email").value;
  const password = document.getElementById("loginPassword").value;

  const db = getDatabase();
  const usersRef = ref(db, "users");

  try {
    const snapshot = await get(usersRef);

    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const userId = userSnapshot.key;
      const emailAddress = userData.email;
      const passwordData = userData.password;
      const isAdminUser = userData.isAdmin || false;

      if (emailAddress === email && passwordData === password) {
        if (isAdminUser) {
          // Redirect admin to dashboard.html
          window.location.href = "dashboard.html";
        } else {
          // Redirect regular user to index.html
          window.location.href = "index.html";
        }

        // Store user information in localStorage
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
        }, 1000);

        return; // Exit the loop if a user is found
      }
    });

    // If no user is found with the given credentials
    console.log("Invalid credentials");
    // Display an error message or handle it accordingly
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Handle the error, e.g., display an error message to the user
  }
});
