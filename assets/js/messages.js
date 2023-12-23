
  // Import the functions you need from the SDKs
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
  import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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
  const db = getDatabase();  // Use getDatabase to get a reference to the database

  function displayMessages() {
    const messagesContainer = document.getElementById('messages-container');

    // Check if the container exists
    if (!messagesContainer) {
      console.error("Messages container not found");
      return;
    }

    const messagesRef = ref(db, "messages");

    onValue(messagesRef, (snapshot) => {
      // Clear the container
      messagesContainer.innerHTML = "";

      snapshot.forEach((message) => {
        const messageData = message.val();
        const messageId = message.key;
        const messageEmail = messageData.email;
        const messageSubject = messageData.subject;
        const messageContent = messageData.message; // Assuming you have a 'message' field in your data

        // Create a card for each message
        const cardElement = document.createElement('div');
        cardElement.classList.add('col-md-4', 'mb-3');

        cardElement.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Email: ${messageEmail}</h5>
              <p class="card-subject">Subject: ${messageSubject}</p>
              <p class="card-content">Message: ${messageContent}</p>
              <button class="btn btn-danger" onclick="deleteMessage('${messageId}')">Delete</button>
            </div>
          </div>
        `;

        // Append card to the container
        messagesContainer.appendChild(cardElement);
      });
    });
  }

  // Call the displayMessages function to show messages on page load
  displayMessages();

  // Function to delete a message
  function deleteMessage(messageId) {
    const messageRefToDelete = ref(db, `messages/${messageId}`);
    remove(messageRefToDelete);
  }