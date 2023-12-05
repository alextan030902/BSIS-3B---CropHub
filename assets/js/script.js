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

  