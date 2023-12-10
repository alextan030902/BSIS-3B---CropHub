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
      cardElement.setAttribute('data-productId', productID);
      cardElement.setAttribute('id', 'productId');

      const imageElement = document.createElement('img');
      imageElement.src = productImage;
      imageElement.classList.add('card-img-top');
      imageElement.setAttribute('id', 'productImage');
      imageElement.alt = productName;

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const cardTitle = document.createElement('h5');
      cardTitle.classList.add('card-title', 'text-capitalize');
      cardTitle.setAttribute('id', 'productName');
      cardTitle.textContent = productName;

      const cardDescription = document.createElement('p');
      cardDescription.classList.add('card-description');
      cardDescription.setAttribute('id', 'productDesc');
      cardDescription.textContent = `${productDescription}`;


      const cardText = document.createElement('p');
      cardText.classList.add('card-text');
      cardText.setAttribute('id', 'productPrice');
      cardText.textContent = `(Price: $${productPrice})`;


      const addToCartButton = document.createElement('button');
      addToCartButton.classList.add('btn', 'btn-primary', 'me-2');
      addToCartButton.setAttribute('id', 'addToCart');
      addToCartButton.textContent = 'Add to cart';

      

      // Append elements to the card
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      cardBody.appendChild(addToCartButton);

      
      

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


  const addToCart = document.getElementById('products-container');
  const cartBadge = document.getElementById('cart-count-badge');
    let cartCount = 0;

    addToCart.addEventListener('click', function (event) {
  if (event.target && event.target.id === 'addToCart') {
    // const userId = '-Nl3qCS0CvHo0-VMXl_6';
    const userId = getUserData();
    const productID = event.target.parentElement.parentElement.dataset.productid;

    const cart = {
      userId: userId,
      productId: productID,
    }

    const cartsRef = ref(db, 'carts');
    const newCartsRef = push(cartsRef);

    set(newCartsRef, cart)
      .then(() => {
        console.log('Product added successfully');

        // Increment the cart count
        cartCount++;

        // Update the cart badge with the new count
        updateCartBadge(cartCount);
      })
      .catch((error) => {
        console.error('Error creating product in Firebase Realtime Database:', error);
      });
  }
});

// Function to update the cart badge with the current cart count
function updateCartBadge(count) {
  if (cartBadge) {
    cartBadge.textContent = count;
  }
}


function viewCarts() {
  const productsContainer = document.getElementById('cart-container');
  let totalCartPrice = 0; // Initialize the total price

  if (!productsContainer) {
    console.error("Products container not found");
    return;
  }

  const cartsRef = ref(db, "carts");

  onValue(cartsRef, (snapshot) => {
    productsContainer.innerHTML = ""; // Clear the container

    snapshot.forEach((cart) => {
      const cartData = cart.val();
      const cartId = cart.key;
      const productId = cartData.productId;
      const userId = cartData.userId;

      getProductData(productId, (productData) => {
        const productPrice = parseFloat(productData.price); // Assuming price is stored as a string

        // Create HTML elements and populate them with product data
        const productContainer = document.createElement('div');
        productContainer.innerHTML = `
          <p>User ID: ${userId}</p>
          <p>Product Name: ${productData.name}</p>
          <p>Product Price: ${productData.price}</p>
          <p>Quantity: <input type="number" min="1" value="${cartData.quantity || 1}" id="quantity_${productId}"></p>
          <p>Product Image: ${productData.image}</p>
          <button class="btn btn-danger" id="closeModalButton" data-product-id="${productId}">Delete</button>
          <hr>
        `;
        productsContainer.appendChild(productContainer);

        // Update the totalCartPrice
        totalCartPrice += productPrice * (cartData.quantity || 1);

        // Display the total price
        displayTotalPrice(totalCartPrice);

        // Add event listener for quantity change
        const quantityInput = document.getElementById(`quantity_${productId}`);
        if (quantityInput) {
          quantityInput.addEventListener('input', function () {
            const newQuantity = parseInt(quantityInput.value, 10) || 1;
            const oldQuantity = cartData.quantity || 1;
            cartData.quantity = newQuantity;

            // Update the totalCartPrice when the quantity changes
            totalCartPrice += productPrice * (newQuantity - oldQuantity);
            displayTotalPrice(totalCartPrice);
          });
        }
      });
    });
  });
}

function displayTotalPrice(totalPrice) {
  // Assuming you have an element to display the total price
  const totalContainer = document.getElementById('total-container');

  if (totalContainer) {
    totalContainer.textContent = `Total Price: ${totalPrice.toFixed(2)}`;
  }
}

function getProductData(productId, callback) {
  const productRef = ref(db, "products");

  onValue(productRef, (snapshot) => {
    snapshot.forEach((product) => {
      const productData = product.val();
      const productID = product.key;

      if (productID === productId) {
        callback(productData);
      }
    });
  });
}

function getUserData(userId) {
  const userRef = ref(db, "users");
  const localUser = JSON.parse(localStorage.getItem('currentUser'));

  onValue(userRef, (snapshot) => {
    snapshot.forEach((product) => {
      const userData = product.val();
      const userID = product.key;

      if (userId === userID) {
        const name = userData.key;
        return name;
      }
    });
  });
}

window.addEventListener('load', viewCarts);




function closeModal() {
  // Close the Bootstrap modal using jQuery
  $('#myModal').modal('hide');
}

// Get the close button element
var closeButton = document.getElementById('closeModalButton');

// Attach the click event listener to the button
closeButton.addEventListener('click', closeModal);



document.addEventListener('DOMContentLoaded', function () {
  // Add a submit event listener to the form
  const messageForm = document.getElementById('messageForm');

  messageForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting and page refresh

    // Get values from the form
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate form data (you can add more validation as needed)

    // Create a message object
    const newMessage = {
      email: email,
      subject: subject,
      message: message
    };

    // Get a reference to the "messages" collection in the database
    const messagesRef = ref(db, "messages");

    // Push a new message to the database
    push(messagesRef, newMessage)
      .then(() => {
        console.log("Message successfully sent!");
        // You can redirect the user to a confirmation page or perform other actions here
      })
      .catch((error) => {
        console.error("Error creating message in Firebase Realtime Database:", error);
      });
  });
});
