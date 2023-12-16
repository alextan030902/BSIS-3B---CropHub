// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";


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

var addProduct = document.getElementById('addProduct');

// Add a click event listener to the Checkout button
addProduct.addEventListener('click', function() {

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const deSC = document.getElementById('deSC').value
    const image = document.getElementById('image').value;

    console.log (name,price,deSC,image);
    const products = {
        name: name,
        price: price,
        deSC: deSC,
        image: image
    }

    const productsRef = ref(db, "products");
    const newProductsRef = push(productsRef);
    set(newProductsRef, products)
        .then(() => {
        console.log("User successfully registered");
        
        })
        .catch((error) => {
        console.error(
            "Error creating user in Firebase Realtime Database:",
            error
        );
    
    })
        
});
