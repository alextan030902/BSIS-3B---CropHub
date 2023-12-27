// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

const firstName = localStorage.getItem("userFirstname");
const lastName = localStorage.getItem("userLastname");
const email = localStorage.getItem("userEmail");

document.getElementById("fullName").value = firstName + lastName;
document.getElementById("email").value = email;

// function viewCarts() {
//     const productsContainer = document.getElementById('cart-container');
//     let totalCartPrice = 0; // Initialize the total price

//     if (!productsContainer) {
//         console.error("Cart container not found");
//         return;
//     }

//     const cartsRef = ref(db, "carts");

//     onValue(cartsRef, (snapshot) => {
//         productsContainer.innerHTML = ""; // Clear the container

//         snapshot.forEach((cart) => {
//             const cartData = cart.val();
//             const cartId = cart.key;
//             const productId = cartData.productId;
//             const userId = cartData.userId;

//             getProductData(productId, (productData) => {

//                 // Create HTML elements and populate them with product data
//                 const productContainer = document.createElement('div');
//                 productContainer.setAttribute('data-cartId', cartId);
//                 productContainer.innerHTML = `
//                     <p>Product Name: ${productData.name}</p>
//                     <p>Product Price: ${productData.price}</p>
//                     <p>Product Quantity: ${cartData.quantity}</p>
//                     <hr>
//                 `;
//                 productsContainer.appendChild(productContainer);

//                 // Add the product price to the totalCartPrice
//                 totalCartPrice += cartData.quantity * productData.price;

//             });
//         });

//         // Display the total cart price
//         const totalContainer = document.createElement('div');
//         productsContainer.appendChild(totalContainer);
      
//         setTimeout(function(){ 
//             const totalContainer = document.createElement('div');
//             totalContainer.innerHTML = `<p>Total Cart Price: ${totalCartPrice}</p>`;
          
//         productsContainer.appendChild(totalContainer);


//          }, 100);
//     });
// }

function viewCarts() {
    const productsContainer = document.getElementById('cart-container');
    let totalCartPrice = 0; // Initialize the total price

    if (!productsContainer) {
        console.error("Cart container not found");
        return;
    }

    // Get the currently logged-in user ID from localStorage
    const currentUserId = localStorage.getItem('userId');

    if (!currentUserId) {
        console.error("User not logged in");
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

            // Check if the cart belongs to the currently logged-in user
        if (userId === currentUserId) {
            getProductData(productId, (productData) => {

                // Create HTML elements and populate them with product data
                const productContainer = document.createElement('div');
                productContainer.setAttribute('data-cartId', cartId);
                productContainer.classList.add('row'); // Add the 'row' class for Bootstrap grid system
                productContainer.innerHTML = `
                <div class="col-md-6">
                    <p style="background-color: goldenrod; border-radius: 8px; padding: 8px; display: inline-block;">${productData.name}</p>
                </div>
                <div class="col-md-6">
                    <p>Product Price: ${productData.price}</p>
                    <p>Product Quantity: ${cartData.quantity}</p>
                </div>
                <div class="col-12"> <!-- Full-width column to create a line break -->
                    <hr>
                </div>
                `;

            // Append productContainer to the document or any other desired parent element
            document.body.appendChild(productContainer);

                    productsContainer.appendChild(productContainer);

                    // Add the product price to the totalCartPrice
                    totalCartPrice += cartData.quantity * productData.price;
                });
            }
        });

        // Move this part outside the forEach loop
        setTimeout(function () {
            const totalContainer = document.createElement('div');
            totalContainer.innerHTML = `<button style="background-color: firebrick; color: white; border-radius: 8px;">Total Cart Price</button>: ${totalCartPrice}`;
            productsContainer.appendChild(totalContainer);
        }, 100);
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

document.addEventListener('DOMContentLoaded', function () {
    // Add a click event listener to the Submit button
    const placeOrders = document.getElementById('placeOrders');

    placeOrders.addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent the form from submitting and page refresh

        // Get values from the form
        const name = document.getElementById('fullName').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('pnumber').value; // Added phone
        const paymentMethod = document.getElementById('paymentMethod').value;
        const currentuserId = localStorage.getItem("userId");

        // Validate form data (you can add more validation as needed)

        // Create an orders object
        const orders = {
            address: address,
            paymentMethod: paymentMethod,
            phone: phone // Added phone
        };

        // Get a reference to the "users" collection in the database
        const usersRef = ref(db, `users/${currentuserId}`);

        try {
            // Update the user's data
            await update(usersRef, orders);
            console.log("Update successfully!");

            // Now, add new orders

            // Get a reference to the "carts" collection in the database
            const cartsRef = ref(db, "carts");

            // Use get method to retrieve user's cart data
            const snapshot = await get(cartsRef);

            // Get a reference to the "orders" collection in the database
            const ordersRef = ref(db, "orders");

            // Array to store promises returned by set
            const setPromises = [];

            // Iterate over the cart data and insert new orders
            snapshot.forEach((cart) => {
                const cartData = cart.val();
                const productId = cartData.productId;
                const userId = cartData.userId;
                const quantity = cartData.quantity;

                // Check if the cart belongs to the current user
                if (currentuserId === userId) {
                    // Push a new order to the database
                    const newOrderRef = push(ordersRef);

                    // Get values for the new order
                    const orderData = {
                        userId: currentuserId,
                        productId: productId,
                        quantity: quantity,
                        phone: phone // Added phone
                    };

                    // Set the new order data and store the promise
                    setPromises.push(set(newOrderRef, orderData));
                }
            });

            await Promise.all(setPromises);

            console.log("Orders placed successfully!");
            alert("Orders placed successfully!");


            window.location.href = 'index.html';
           

            // Display the updated cart after placing orders
            viewCarts();
        } catch (error) {
            console.error("Error updating user data or creating orders in Firebase Realtime Database:", error);
        }
    });
});

window.addEventListener('load', viewCarts);


function clearCart() {
    // Get a reference to the "carts" collection in the database
    const cartsRef = ref(db, "carts");

    // Remove all data from the "carts" collection (assuming you want to clear the entire cart)
    remove(cartsRef);
}