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

    // Create a single row to hold all message columns
    const row = document.createElement('div');
    row.classList.add('row', 'g-4');

    snapshot.forEach((message) => {
      const messageData = message.val();
      const messageId = message.key;
      const messageEmail = messageData.email;
      const messageSubject = messageData.subject;
      const messageContent = messageData.message; // Assuming you have a 'message' field in your data

      // Create a column for each message card
      const col = document.createElement('div');
      col.classList.add('col-md-4'); // Adjust the column size as needed

      // Create and populate HTML elements for each message card
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const cardTitle = document.createElement('h5');
      cardTitle.classList.add('card-title', 'text-capitalize');
      cardTitle.textContent = `Email: ${messageEmail}`;

      const cardSubject = document.createElement('p');
      cardSubject.classList.add('card-subject');
      cardSubject.textContent = `Subject: ${messageSubject}`;

      const cardContent = document.createElement('p');
      cardContent.classList.add('card-content');
      cardContent.textContent = `Message: ${messageContent}`;

      const buttonGroup = document.createElement('div');
      buttonGroup.classList.add('d-grid', 'gap-2', 'd-md-block');

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'btn-danger');
      deleteButton.textContent = 'Delete';

      // Add event listener for delete button
      deleteButton.addEventListener('click', () => {
        // Delete the message from Firebase
        const messageRefToDelete = ref(db, `messages/${messageId}`);
        remove(messageRefToDelete);
      });

      // Append elements to the card
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardSubject);
      cardBody.appendChild(cardContent);
      cardBody.appendChild(deleteButton);

      cardElement.appendChild(cardBody);

      // Add card column to the row
      row.appendChild(col);
      col.appendChild(cardElement);
    });

    // Append the row to the messages container
    messagesContainer.appendChild(row);
  });
}

// Call the displayMessages function to show messages on page load
displayMessages();
