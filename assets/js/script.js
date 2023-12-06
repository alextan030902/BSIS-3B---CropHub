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
document.addEventListener('DOMContentLoaded', function () {
  var addToCartButtons = document.querySelectorAll('.addToCartButton');
  var totalCartPrice = 0;
  var cartItems = []; // Array to store cart items with quantity

  addToCartButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var productName = button.getAttribute('data-name');
      var productPrice = parseFloat(button.getAttribute('data-price'));
      var productId = button.getAttribute('data-productId');

      // Check if the product is already in the cart
      var existingCartItem = cartItems.find(item => item.productId === productId);

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

  document.getElementById('cartModal').addEventListener('show.bs.modal', function (e) {
    updateCartDisplay();
  });

  function updateCartDisplay() {
    var cartItemsContainer = document.getElementById('cartItems');
    var fragment = document.createDocumentFragment(); // Create a document fragment

    cartItems.forEach(function (item) {
      var listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.textContent = item.productName + ' - ₱' + item.totalPrice.toFixed(2) + ' (Quantity: ' + item.quantity + ')';

      // Add increment, decrement, and delete buttons
      var incrementButton = createButton('+', 'btn-success', function () {
        incrementItem(item);
      });

      var decrementButton = createButton('-', 'btn-warning', function () {
        decrementItem(item);
      });

      var deleteButton = createButton('Delete', 'btn-danger', function () {
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
    var button = document.createElement('button');
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
      var index = cartItems.indexOf(item);
      cartItems.splice(index, 1);
    }
    totalCartPrice = calculateTotalCartPrice();
    updateCartDisplay();
  }

  function deleteItem(item) {
    // Remove the item from the cart and update the total price
    var index = cartItems.indexOf(item);
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

  