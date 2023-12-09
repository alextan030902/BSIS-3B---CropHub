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


      const addToCart=document.getElementById('products-container');
      addToCart.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'addToCart') {
            // Handle the "Add to Cart" button click
            const userId = '-Nl3qCS0CvHo0-VMXl_6';
            const productID =event.target.parentElement.parentElement.dataset.productid;

    

      const cart = {
          userId: userId,
          productId: productID,
      }

      const cartsRef = ref(db, "carts");
      const newCartsRef = push(cartsRef);
      set(newCartsRef, cart)
          .then(() => {
              console.log("Product added successfully ");
          })
          .catch((error) => {
              console.error(
                  "Error creating product in Firebase Realtime Database:",
                  error
              );
          })
  }
});

function viewCarts() {
  const productsContainer = document.getElementById('cart-container');

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
        // Create HTML elements and populate them with product data
        const productContainer = document.createElement('div');
        productContainer.innerHTML = `
          <p>User ID: ${userId}</p>
          <p>Product Name: ${productData.name}</p>
          <p>Product Price: ${productData.price}</p>
          <p>Product Image: ${productData.image}</p>
          
          <hr>
        `;
        productsContainer.appendChild(productContainer);
      });
    });
  });
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

window.addEventListener('load', viewCarts);
