// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";


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


function displayAllProducts() {
    const productsContainer = document.getElementById('products-container');
  
    // Check if the container exists
    if (!productsContainer) {
      console.error("Products container not found");
      return;
    }
  
    const productsRef = ref(db, "products");
  
    onValue(productsRef, (snapshot) => {
      // Clear the container
      productsContainer.innerHTML = "";

      // Create a single row to hold all product columns
    const row = document.createElement('div');
    row.classList.add('row', 'g-4');
  
      snapshot.forEach((userSnapshot) => {
        const userData = userSnapshot.val();
        const productID = userSnapshot.key;
        const productName = userData.name;
        const productPrice = userData.price;
        const productImage = userData.image;
        const productDescription = userData.description; // assuming description exists   
       
        
         // Create a column for each product card
      const col = document.createElement('div');
      col.classList.add('col-md-4'); // Adjust the column size as needed

      // Create and populate HTML elements for each product card
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');

    //   Create and populate HTML elements
      cardElement.classList.add('col');
      cardElement.classList.add('card');

      const imageElement = document.createElement('img');
      imageElement.src = productImage;
      imageElement.classList.add('card-img-top');
      imageElement.alt = productName;

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const cardTitle = document.createElement('h5');
      cardTitle.classList.add('card-title', 'text-capitalize');
      cardTitle.textContent = productName;

      const cardDescription = document.createElement('p');
      cardDescription.classList.add('card-description');
      cardDescription.textContent = `${productDescription}`;


      const cardText = document.createElement('p');
      cardText.classList.add('card-text');
      cardText.textContent = `(Price: $${productPrice})`;

      const buttonGroup = document.createElement('div');
      buttonGroup.classList.add('d-grid', 'gap-2', 'd-md-block');

      const editButton = document.createElement('a');
      editButton.href = 'edit-product.html';
      editButton.classList.add('btn', 'btn-primary', 'me-2');
      editButton.textContent = 'Edit';

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'btn-danger');
      deleteButton.textContent = 'Delete';

      // Append elements to the card
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      cardBody.appendChild(buttonGroup);

      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(deleteButton);

      cardElement.appendChild(imageElement);
      cardElement.appendChild(cardBody);

      // Add card to container
      productsContainer.appendChild(cardElement);

     
      col.appendChild(cardElement);

      // Append the column to the row
      row.appendChild(col);

      });
       // Append the row to the products container
    productsContainer.appendChild(row);
    });
  }
  
  window.addEventListener('load', displayAllProducts);
  





   


