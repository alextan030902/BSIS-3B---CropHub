// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";


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
const db = getDatabase();


document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('#addToCartButton');

  addToCartButtons.forEach(button => {
      button.addEventListener('click', function () {
         
          const name = this.getAttribute('data-name');
          const price = this.getAttribute('data-price');
          const productId = this.getAttribute('data-productId');

          // Call the addtoCart function with the extracted data
          addtoCart(productId, name, price);
      });
  });
});

// Your original addtoCart function
function addtoCart(productId, name, price) {
  const db = getDatabase();
  set(ref(db, 'products/' + productId), {
      productName: name,
      price: price,
  });
}

  // Function to add an item to the cart
  function addToCart(itemName, itemPrice) {
    var cartItem = {
      name: itemName,
      price: itemPrice
    };

    // Check if localStorage supports JSON
    if (typeof Storage !== "undefined") {
      // Retrieve the cart items from localStorage
      var cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Add the new item to the cart
      cart.push(cartItem);

      // Save the updated cart back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update the cart modal
      updateCartModal();
    } else {
      alert("Sorry, your browser does not support Web Storage. Please use a different browser.");
    }
  }

  var shoppingCart = (function () {
    var cart = [];
  
    function Item(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }
  
    // Save cart
    function saveCart() {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
  
    // Load cart
    function loadCart() {
      cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    }
  
    if (localStorage.getItem('shoppingCart') !== null) {
      loadCart();
    }
  
    var obj = {};
  
    // Add to cart
    obj.addItemToCart = function (name, price, count) {
      var existingItem = cart.find(item => item.name === name);
  
      if (existingItem) {
        existingItem.count += count;
      } else {
        var newItem = new Item(name, price, count);
        cart.push(newItem);
      }
  
      saveCart();
    };
  
    // Set count from item
    obj.setCountForItem = function (name, count) {
      var item = cart.find(item => item.name === name);
      if (item) {
        item.count = count;
        saveCart();
      }
    };
  
    // Remove item from cart
    obj.removeItemFromCart = function (name) {
      var itemIndex = cart.findIndex(item => item.name === name);
  
      if (itemIndex !== -1) {
        cart[itemIndex].count--;
  
        if (cart[itemIndex].count === 0) {
          cart.splice(itemIndex, 1);
        }
  
        saveCart();
      }
    };
  
    // Remove all items from cart
    obj.removeItemFromCartAll = function (name) {
      cart = cart.filter(item => item.name !== name);
      saveCart();
    };
  
    // Clear cart
    obj.clearCart = function () {
      cart = [];
      saveCart();
    };
  
    // Count cart
    obj.totalCount = function () {
      return cart.reduce((totalCount, item) => totalCount + item.count, 0);
    };
  
    // Total cart
    obj.totalCart = function () {
      return cart.reduce((totalCart, item) => totalCart + item.price * item.count, 0).toFixed(2);
    };
  
    // List cart
    obj.listCart = function () {
      return cart.map(item => ({
        name: item.name,
        price: item.price,
        count: item.count,
        total: (item.price * item.count).toFixed(2),
      }));
    };
  
    return obj;
  })();
  
  // Rest of your code remains unchanged
  

// document.addEventListener('DOMContentLoaded', function () {
//   const form = document.querySelector('form');

//   form.addEventListener('submit', function (event) {
//       event.preventDefault();

//       const email = document.querySelector('input[name="email"]').value;
//       const password = document.querySelector('input[name="pass"]').value;

//       // Perform client-side validation (you can add more validation as needed)
//       if (!email || !password) {
//           alert('Please fill in all fields');
//           return;
//       }

//       // Perform asynchronous request to the server using Fetch API
//       fetch('your_server_script.php', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/x-www-form-urlencoded',
//           },
//           body: new URLSearchParams({
//               email: email,
//               pass: password,
//               submit: true,
//           }),
//       })
//       .then(response => response.json())
//       .then(data => {
//           // Handle the response from the server
//           if (data.success) {
//               alert('Login successful');
//               // Redirect to the appropriate page based on user type
//               if (data.userType === 'admin') {
//                   window.location.href = 'admin_page.html';
//               } else if (data.userType === 'user') {
//                   window.location.href = 'index.html';
//               }
//           } else {
//               alert(data.message);
//           }
//       })
//       .catch(error => {
//           console.error('Error:', error);
//       });
//   });
// });
