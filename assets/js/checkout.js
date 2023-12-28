// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, get, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

    const currentUserId = localStorage.getItem('userId');

    if (!currentUserId) {
        console.error("User not logged in");
        return;
    }

    const cartsRef = ref(db, "carts");

    onValue(cartsRef, async (snapshot) => {
        productsContainer.innerHTML = ""; // Clear the container

        const fetchProductPromises = [];

        snapshot.forEach((cart) => {
            const cartData = cart.val();
            const cartId = cart.key;
            const productId = cartData.productId;
            const userId = cartData.userId;

            if (userId === currentUserId) {
                const fetchProductPromise = new Promise((resolve) => {
                    getProductData(productId, (productData) => {
                        const productContainer = document.createElement('div');
                        productContainer.setAttribute('data-cartId', cartId);
                        productContainer.classList.add('row');
                        productContainer.innerHTML = `
                            <div class="col-md-6">
                                <p style="background-color: goldenrod; border-radius: 8px; padding: 8px; display: inline-block;">${productData.name}</p>
                            </div>
                            <div class="col-md-6">
                                <p>Product Price: ${productData.price}</p>
                                <p>Product Quantity: ${cartData.quantity}</p>
                            </div>
                            <div class="col-12">
                                <hr>
                            </div>
                        `;
                        productsContainer.appendChild(productContainer);

                        totalCartPrice += cartData.quantity * productData.price;
                        resolve();
                    });
                });

                fetchProductPromises.push(fetchProductPromise);
            }
        });

        await Promise.all(fetchProductPromises);

        const totalContainer = document.createElement('div');
        totalContainer.innerHTML = `<button style="background-color: firebrick; color: white; border-radius: 8px;">Total Cart Price</button>: ${totalCartPrice}`;
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
        event.preventDefault();

        const name = document.getElementById('fullName').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('pnumber').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const currentuserId = localStorage.getItem("userId");

        const orders = {
            address: address,
            paymentMethod: paymentMethod,
            phone: phone
        };

        const usersRef = ref(db, `users/${currentuserId}`);

        try {
           
            const ordersRef = ref(db, `orders/${currentuserId}`);
            const setPromises = [];

            const cartsRef = ref(db, "carts");
            const snapshot = await get(cartsRef);update

            let totalCartPrice = 0;

            snapshot.forEach((cart) => {
                const cartData = cart.val();
                const productId = cartData.productId;
                const userId = cartData.userId;
                const quantity = cartData.quantity;

                if (currentuserId === userId) {
                    const newOrderRef = push(ordersRef);

                    const orderData = {
                        productId: productId,
                        quantity: quantity,
                    };

                    setPromises.push(set(newOrderRef, orderData));

                    getProductData(productId, (productData) => {
                        totalCartPrice += quantity * productData.price;
                    });
                }
            });

            setPromises.push(update(usersRef, { totalCartPrice }));

            await Promise.all(setPromises);

            console.log("Orders placed successfully!");
            alert("Orders placed successfully!");

            window.location.href = 'index.html';

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
