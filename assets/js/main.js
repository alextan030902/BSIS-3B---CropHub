// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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
const auth = getAuth();



// Get reference to the Firebase database
const database = db;  // Use the reference to the database from getDatabase()

// Add click event to addToCartButton
document.querySelectorAll('.addToCartButton').forEach(function(button) {
  button.addEventListener('click', function() {
    // Get product details from the button's data attributes
    const productName = this.getAttribute('data-name');
    const productPrice = parseFloat(this.getAttribute('data-price'));
    const productId = this.getAttribute('data-productId');

    // Push the product to the database
    set(ref(db, 'cart/' + productId), {
      name: productName,
      price: productPrice
    });
  });
});

// Get the Checkout button and Cart items list
var checkoutButton = document.getElementById('checkoutButton');
var cartItemsList = document.getElementById('cartItems');

// Add a click event listener to the Checkout button
checkoutButton.addEventListener('click', function() {
  // Get the list of items from the cart modal
  var cartItems = cartItemsList.getElementsByClassName('list-group-item');

  // Create an array to store the item details
  var itemDetails = [];

  // Loop through each item in the cart modal and add it to the array
  for (var i = 0; i < cartItems.length; i++) {
    // Get the text content of the cart item
    var itemText = cartItems[i].textContent;
    // Add the item details to the array
    itemDetails.push(itemText);
  }

  // Store the item details in localStorage (you can use other methods as well)
  localStorage.setItem('itemDetails', JSON.stringify(itemDetails));

  // Redirect to checkout.html
  window.location.href = 'checkout.html';
});

document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('.addToCartButton');
  let totalCartPrice = 0;
  const cartItems = []; // Array to store cart items with quantity

  addToCartButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const productName = button.getAttribute('data-name');
      const productPrice = parseFloat(button.getAttribute('data-price'));
      const productId = button.getAttribute('data-productId');

      // Check if the product is already in the cart
      const existingCartItem = cartItems.find(item => item.productId === productId);

      if (existingCartItem) {
        // If the product is already in the cart, increment the quantity
        existingCartItem.quantity++;
        existingCartItem.totalPrice = existingCartItem.quantity * productPrice;
      } else {
        // If the product is not in the cart, add it with quantity 1
        cartItems.push({
          productId: productId,
          productName: productName,
          quantity: 1,
          productPrice: productPrice, // Added productPrice to the cart item
          totalPrice: productPrice
        });
      }

      totalCartPrice = calculateTotalCartPrice();
      updateCartDisplay();

      console.log('Product added to cart. ProductName: ' + productName);
    });
  });

  function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const fragment = document.createDocumentFragment(); // Create a document fragment

    cartItems.forEach(function (item) {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.textContent = item.productName + ' - ₱' + item.totalPrice.toFixed(2) + ' (Quantity: ' + item.quantity + ')';

      // Add increment, decrement, and delete buttons
      const incrementButton = createButton('+', 'btn-success', function () {
        incrementItem(item);
      });

      const decrementButton = createButton('-', 'btn-warning', function () {
        decrementItem(item);
      });

      const deleteButton = createButton('Delete', 'btn-danger', function () {
        deleteItem(item);
      });

      listItem.appendChild(incrementButton);
      listItem.appendChild(decrementButton);
      listItem.appendChild(deleteButton);

      fragment.appendChild(listItem); // Append the item to the fragment
    });

    // Clear the existing items and append the fragment
    cartItemsContainer.innerHTML = '';
    cartItemsContainer.appendChild(fragment);

    // Update the HTML element displaying the total price in the modal
    document.getElementById('cartTotal').textContent = 'Total: ₱' + totalCartPrice.toFixed(2);
  }

  function createButton(text, className, clickHandler) {
    const button = document.createElement('button');
    button.className = 'btn btn-sm ' + className + ' mx-2';
    button.textContent = text;
    button.addEventListener('click', clickHandler);
    return button;
  }

  function calculateTotalCartPrice() {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  function incrementItem(item) {
    item.quantity++;
    item.totalPrice = item.quantity * item.productPrice;
    totalCartPrice = calculateTotalCartPrice();
    updateCartDisplay();
  }

  function decrementItem(item) {
    if (item.quantity > 1) {
      item.quantity--;
      item.totalPrice = item.quantity * item.productPrice;
    } else {
      // If quantity is 1, remove the item from the cart
      const index = cartItems.indexOf(item);
      cartItems.splice(index, 1);
    }
    totalCartPrice = calculateTotalCartPrice();
    updateCartDisplay();
  }

  function deleteItem(item) {
    // Remove the item from the cart and update the total price
    const index = cartItems.indexOf(item);
    cartItems.splice(index, 1);
    totalCartPrice = calculateTotalCartPrice();
    updateCartDisplay();
  }
});



// search function
$(document).ready(function() {
  $('#search_field').on('keyup', function() {
    var value = $(this).val();
    var patt = new RegExp(value, "i");

    $('.tab_content').find('.col-lg-3').each(function() {
      var $table = $(this);
      var $featuredItem = $table.find('.featured-item');

      if (!$featuredItem.text().match(patt)) {
        $table.hide();
      } else {
        $table.show();
        document.getElementById('not_found').style.display = 'none';
      }
    });

    var visibleItems = $('.tab_content .col-lg-3:visible');

    if (visibleItems.length === 0) {
      document.getElementById("not_found").innerHTML = "Product not found.";
      document.getElementById('not_found').style.display = 'block';
    } else {
      document.getElementById('not_found').style.display = 'none';
    }
  });
});



















// document.addEventListener('DOMContentLoaded', function () {
//   const addToCartButtons = document.querySelectorAll('#addToCartButton');

//   addToCartButtons.forEach(button => {
//       button.addEventListener('click', function () {
         
//           const name = this.getAttribute('data-name');
//           const price = this.getAttribute('data-price');
//           const productId = this.getAttribute('data-productId');

//           // Call the addtoCart function with the extracted data
//           addtoCart(productId, name, price);
//       });
//   });
// });

// // Your original addtoCart function
// function addtoCart(productId, name, price) {
//   const db = getDatabase();
//   set(ref(db, 'products/' + productId), {
//       productName: name,
//       price: price,
//   });
// }




// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
// import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBQSCj2eOEIxGSVfRtbCMIQKzqORsZ-dks",
//   authDomain: "newproject-db3b1.firebaseapp.com",
//   databaseURL: "https://newproject-db3b1-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "newproject-db3b1",
//   storageBucket: "newproject-db3b1.appspot.com",
//   messagingSenderId: "436296489551",
//   appId: "1:436296489551:web:e22f77e5080ca9ec37a83a"
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const db = getDatabase(firebaseApp);
// const auth = getAuth(firebaseApp);

// // ... (your existing imports and Firebase configuration)

// document.addEventListener('DOMContentLoaded', () => {
//     const addToCartButtons = document.querySelectorAll('[id^="addToCartBtn"]');

//     if (addToCartButtons.length > 0) {
//         addToCartButtons.forEach(button => {
//             button.addEventListener('click', () => {
//                 const user = auth.currentUser;

//                 if (user) {
//                     // User is logged in, add to cart logic here
//                     addToCart(user.uid);
//                 } else {
//                     // User is not logged in, redirect to login page
//                     window.location.href = 'login.html';
//                 }
//             });
//         });
//     } else {
//         console.error('Error: No elements with ID starting with "addToCartBtn" found.');
//     }
// });

// function addToCart(userId) {
//     // Implement your logic to add to cart using Realtime Database
//     const cartRef = ref(db, `carts/${userId}`);
//     // Example: Add an item to the user's cart
//     set(cartRef.push(), {
//         productId: 'your-product-id',
//         quantity: 1
//     }).then(() => {
//         alert('Item added to cart!');
//     }).catch((error) => {
//         console.error('Error adding to cart:', error);
//     });
// }

// // Listen for authentication state changes
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         console.log('User is logged in:', user.displayName);
//     } else {
//         console.log('User is not register');
//     }
// });

