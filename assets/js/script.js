// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove, get, update} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import {getStorage, ref as storageRef, uploadBytes, getDownloadURL,} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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

      const cardQty = document.createElement('p'); // Create a paragraph element
      const inputElement = document.createElement('input'); // Create an input element
      cardQty.appendChild(inputElement);
      inputElement.type = 'number'; // Set the input type correctly
      inputElement.classList.add('card-text'); // Add the desired class
      inputElement.setAttribute('id', 'productQty'); // Set the ID attribute

      
      const addToCartButton = document.createElement('button');
      addToCartButton.classList.add('btn', 'btn-primary', 'me-2');
      addToCartButton.setAttribute('id', 'addToCart');
      addToCartButton.textContent = 'Add to cart';

      

      // Append elements to the card
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      cardBody.appendChild(cardQty);
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


  const addToCart = document.getElementById('products-container'); // assuming element ID
  

  addToCart.addEventListener("click", async function (event) {
    if (event.target && event.target.id === 'addToCart') {
      try {
        // Retrieve user data asynchronously
        const userData = await getUserData();
        const userId = userData.userId;
        const quantityInput = document.getElementById("productQty");
        const quantity = quantityInput.value;
  
        // Check if quantity is a valid number
        if (isNaN(quantity) || quantity.trim() === "") {
          console.error("Invalid quantity input:", quantity);
          return;
        }
  
        const parsedQuantity = parseInt(quantity);
  
        if (isNaN(parsedQuantity)) {
          console.error("Failed to parse quantity as a number:", quantity);
          return;
        }
  
        const productID = event.target.parentElement.parentElement.dataset.productid;
  
        const cartsRef = ref(db, "carts");
  
        let executedOnce = false;
  
        // Retrieve data only once
        get(cartsRef)
          .then((snapshot) => {
            if (!executedOnce) {
              let productExists = false;
  
              snapshot.forEach((userSnapshot) => {
                const cartData = userSnapshot.val();
                const cartKey = userSnapshot.key;
                const productId = cartData.productId;
                const qty = cartData.quantity;
  
                if (productId === productID) {
                  productExists = true;
  
                  const updateCartRef = ref(db, `carts/${cartKey}`);
  
                  // Check if qty is defined and is a valid number
                  const currentQuantity = (typeof qty !== 'undefined' && !isNaN(qty)) ? parseInt(qty) : 0;
  
                  const updatedQuantity = currentQuantity + parsedQuantity;
  
                  // Check if the updated quantity is a valid number
                  if (isNaN(updatedQuantity)) {
                    console.error("Invalid updated quantity:", updatedQuantity);
                    return;
                  }
  
                  update(updateCartRef, { quantity: updatedQuantity })
                    .then(() => {
                      console.log("Item updated successfully");
                    })
                    .catch((error) => {
                      console.error(
                        "Error updating item in Firebase Realtime Database:",
                        error
                      );
                    });
                }
              });
  
              if (!productExists) {
                console.log("Adding new item to the cart");
                const newCartRef = push(cartsRef);
                const cart = {
                  userId: userId,
                  productId: productID,
                  quantity: parsedQuantity
                };
  
                // Set data in the new reference
                set(newCartRef, cart)
                  .then(() => {
                    console.log("Item added successfully");
                  })
                  .catch((error) => {
                    console.error(
                      "Error adding item to Firebase Realtime Database:",
                      error
                    );
                  });
              }
  
              executedOnce = true;
            }
          })
          .catch((error) => {
            console.error("Error retrieving data from Firebase:", error);
          });
  
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });

  getCount(); 
  

  let total = 0; // Declare total as a global variable

  function viewCarts() {
    const productsContainer = document.getElementById('cart-container');
  
    if (!productsContainer) {
      console.error("Cart container not found");
      return;
    }
  
    const cartsRef = ref(db, "carts");
  
    // Reset total before processing the cart
    total = 0;
  
    onValue(cartsRef, (snapshot) => {
      productsContainer.innerHTML = ""; // Clear the container
  
      snapshot.forEach((cart) => {
        const cartData = cart.val();
        const cartId = cart.key;
        const productId = cartData.productId;
        const userId = cartData.userId;
  
        getProductData(productId, (productData, quantity) => {
          const productPrice = parseFloat(productData.price);
          const itemTotal = productPrice * quantity;
  
          total += itemTotal;
  
          // Create HTML elements and populate them with product data
          const productContainer = document.createElement('div');
          productContainer.setAttribute('data-cartId', cartId);
          productContainer.innerHTML = `
            <p>User ID: ${userId}</p>
            <p>Product Name: ${productData.name}</p>
            <p>Product Price: ${productData.price}</p>
            <p>Quantity: <input type='number' name= 'quantity' id='quantity'value='${cartData.quantity}'></p>
            <button class="btn btn-danger deleteButton" data-cartId="${cartId}">Delete</button>
            <hr>
          `;
          productsContainer.appendChild(productContainer);
  
          document.getElementById('quantity').value = cartData.quantity;
  
          // Add event listener for delete button
          const deleteButton = productContainer.querySelector('.deleteButton');
          if (deleteButton) {
            deleteButton.addEventListener('click', async function () {
              await remove(ref(db, `carts/${cartId}`));
              getCount(); // Call getCount after removing an item from the cart
              updateTotal(); // Update the total after removing an item
            });
          }
        });
      });
  
      updateTotal(); // Update the total after processing the entire cart
    });
  }
  
  function updateTotal() {
    // Display or use the total wherever needed
    console.log(`Total Price: ${total}`);
    // Update your HTML element with the total
    document.getElementById('total-price').textContent = total.toFixed(2);
  }
  
  // Call getCount when the page loads to initialize the cart count
  getCount();
  

  function getCount() {
    const cartsRef = ref(db, "carts");
  
    onValue(cartsRef, (snapshot) => {
      const count = snapshot.val() ? Object.keys(snapshot.val()).length : 0;
      console.log(`Number of carts: ${count}`);
      document.getElementById('cart-badge').textContent = count;
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


function getUserData() {
  return new Promise((resolve, reject) => {
    const userRef = ref(db, "users");
    const userId = localStorage.getItem('userId');

    if (!userId) {
      reject("User ID not found in localStorage");
      return;
    }

    onValue(userRef, (snapshot) => {
      let found = false;

      snapshot.forEach((product) => {
        const userData = product.val();
        const userID = product.key;

        if (userId === userID) {
          const name = userData.key;
          found = true;
          resolve({ userId, name });
        }
      });

      if (!found) {
        reject("User not found in the database");
      }
    }, (error) => {
      reject(error);
    });
  });
}

// Example of using the function
getUserData()
  .then(({ userId, name }) => {
    console.log("ID is sucessfully retrieved User ID:", userId);
    
  
  })
  .catch((error) => {
    console.error("Error:", error);
  });


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


const fullName = localStorage.getItem("userFirstname") + " " + localStorage.getItem("userLastname");

document.getElementById("fullName").textContent = fullName;

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "login.html";

});

document.addEventListener('click', function(event) {
  const target = event.target.closest('#deleteButton');
  if (target) {
    const cartid = target.dataset.cartid;
    // Handle click on delete button
    console.log(`Delete button clicked for cart item with ID: ${cartid}`);

    const db = getDatabase();
    const cartsRef = ref(db, `carts/${cartid}`)

    remove(cartsRef)
      .then(() => {
        console.log("Item deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting item from Firebase Realtime Database:", error);
      });

  }
});

const email = localStorage.getItem("userEmail");
document.getElementById("email").value = email;





