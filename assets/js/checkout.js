// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, get} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

function viewCarts() {
    const productsContainer = document.getElementById('cart-container');
    let totalCartPrice = 0; // Initialize the total price

    if (!productsContainer) {
        console.error("Cart container not found");
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
                productContainer.setAttribute('data-cartId', cartId);
                productContainer.innerHTML = `
                    <p>Product Name: ${productData.name}</p>
                    <p>Product Price: ${productData.price}</p>
                    <p>Product Quantity: ${cartData.quantity}</p>
                    <hr>
                `;
                productsContainer.appendChild(productContainer);

                // Add the product price to the totalCartPrice
                totalCartPrice += cartData.quantity * productData.price;

            });
        });

        // Display the total cart price
        const totalContainer = document.createElement('div');
        totalContainer.innerHTML = `<p>Total Cart Price: ${totalCartPrice}</p>`;
        productsContainer.appendChild(totalContainer);
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
        const paymentMethod = document.getElementById('paymentMethod').value;
        const currentuserId = localStorage.getItem("userId");

        // Validate form data (you can add more validation as needed)

        // Create an orders object
        const users = {
            address: address,
            paymentMethod: paymentMethod
        };

        // Get a reference to the "users" collection in the database
        const usersRef = ref(db, `users/${currentuserId}`);

        try {
            // Update the user's data
            await update(usersRef, users);
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
                    };

                    // Set the new order data and store the promise
                    setPromises.push(set(newOrderRef, orderData));
                }
            });

            // Wait for all set promises to resolve
            await Promise.all(setPromises);

            console.log("Orders placed successfully!");

            // Optionally, you can clear the user's cart after placing orders
            // const userCartRef = ref(cartsRef, currentuserId);
            // remove(userCartRef);

            // Refresh the cart view after placing orders
            viewCarts();
        } catch (error) {
            console.error("Error updating user data or creating orders in Firebase Realtime Database:", error);
        }
    });
});

window.addEventListener('load', viewCarts);

function deleteProduct(productId) {
    const productsRefToDelete = ref(db, `products/${productId}`);
    remove(productsRefToDelete);
}