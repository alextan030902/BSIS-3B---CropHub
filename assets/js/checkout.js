// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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
    // Add a click event listener to the Submit button
    const placeOrders = document.getElementById('placeOrders');

    placeOrders.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the form from submitting and page refresh

        // Get values from the form
        const name = document.getElementById('fullName').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        const paymentMethod = document.getElementById('paymentMethod').value;

        // Validate form data (you can add more validation as needed)

        // Create an orders object
        const orders = {
            name: name,
            address: address,
            email: email,
            paymentMethod: paymentMethod
        };

        // Get a reference to the "orders" collection in the database
        const ordersRef = ref(db, "orders");

        // Push a new order to the database
        const newOrdersRef = push(ordersRef);
        set(newOrdersRef, orders)
            .then(() => {
                console.log("Order successfully placed");
                // You can redirect the user to a confirmation page or perform other actions here
            })
            .catch((error) => {
                console.error("Error creating orders in Firebase Realtime Database:", error);
            });
    });
});

        const firstName = localStorage.getItem("userFirstname");
        const lastName = localStorage.getItem("userLastname");
        const email = localStorage.getItem("userEmail");
        
        document.getElementById("fullName").value = firstName + lastName; 
        document.getElementById("email").value = email;

        // const ordrersRef = ref(db, `orders/${orderId}`);
        // update(ordrersRef, orders)
        //     .then(() => {
        //     console.log("Item updated successfully");
        //     updateItemForm.reset();
        //     })
        //     .catch((error) => {
        //     console.error(
        //         "Error updating item in Firebase Realtime Database:",
        //         error
        //     );
        //     updateSuccess = false;
        //     })
        //     .finally(() => {
        //     if (updateSuccess) {
        //         window.location.href = "/baylo/products.html";
        //     }
        //     });

        
