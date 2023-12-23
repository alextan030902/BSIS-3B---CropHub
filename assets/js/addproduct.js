// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

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
const storage = getStorage();

var addProduct = document.getElementById('addProduct');

// Add a click event listener to the Add Product button
addProduct.addEventListener('click', async function() {
    // Get product information from input fields
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const deSC = document.getElementById('deSC').value;
    const itemImage = document.getElementById("itemImage").files[0];

    // Upload image to Firebase Storage
    const storageBucketRef = storageRef(storage, "item_images");
    const imageFileName = `${Date.now()}_${itemImage.name}`;
    const imageRef = storageRef(storageBucketRef, imageFileName);
    await uploadBytes(imageRef, itemImage);

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(imageRef);

    // Create a products object with image URL
    const products = {
        name: name,
        price: price,
        deSC: deSC,
        image: imageUrl // Add image URL to the products object
    };

    // Add product data to the Realtime Database
    const productsRef = ref(db, "products");
    const newProductsRef = push(productsRef);

    try {
        await set(newProductsRef, products);
        console.log("Product added successfully");
    } catch (error) {
        console.error("Error adding product to Firebase Realtime Database:", error);
    }
});
