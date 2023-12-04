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
$('#search_field').on('keyup', function() {
  var value = $(this).val();
  var patt = new RegExp(value, "i");

  $('.tab_content').find('.col-lg-3').each(function() {
    var $table = $(this);
    
    if (!($table.find('.featured-item').text().search(patt) >= 0)) {
      $table.not('.featured-item').hide();
    }
    if (($table.find('.col-lg-3').text().search(patt) >= 0)) {
      $(this).show();
      document.getElementById('not_found').style.display = 'none';
    } else {
      document.getElementById("not_found").innerHTML = " Product not found..";
      document.getElementById('not_found').style.display = 'block';
    }
    
  });
  
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
