// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase, ref, onValue, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

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

// Get references to the nodes in the Firebase Realtime Database
const productsRef = ref(db, 'products');
const ordersRef = ref(db, 'orders');
const messagesRef = ref(db, 'messages');
const usersRef = ref(db, 'users');

// Get references to HTML elements where you want to display the counts
const totalProductsElement = document.getElementById('productsAdded');
const totalOrdersElement = document.getElementById('totalOrders');
const totalMessagesElement = document.getElementById('totalMessages');
const totalUsersElement = document.getElementById('totalUsers');

// Listen for changes to the 'products' node
onValue(productsRef, (snapshot) => {
  let totalProducts = snapshot.val() ? Object.keys(snapshot.val()).length : 0;

  // Update the HTML with the total number of products
  totalProductsElement.innerText = `${totalProducts}`;
});

// Listen for changes to the 'orders' node
onValue(ordersRef, (snapshot) => {
  let totalOrders = snapshot.val() ? Object.keys(snapshot.val()).length : 0;

  // Update the HTML with the total number of orders
  totalOrdersElement.innerText = `${totalOrders}`;
});

// Listen for changes to the 'messages' node
onValue(messagesRef, (snapshot) => {
  let totalMessages = snapshot.val() ? Object.keys(snapshot.val()).length : 0;

  // Update the HTML with the total number of messages
  totalMessagesElement.innerText = `${totalMessages}`;
});

// Listen for changes to the 'users' node
onValue(usersRef, (snapshot) => {
  let totalUsers = snapshot.val() ? Object.keys(snapshot.val()).length : 0;

  // Update the HTML with the total number of users
  totalUsersElement.innerText = `${totalUsers}`;
});

const totalCompletedElement = document.getElementById('totalCompleted');
const totalPendingElement = document.getElementById('totalPending');

// Listen for changes to the 'orders' node
onValue(ordersRef, (snapshot) => {
  const orders = snapshot.val() || {};
  
  // Filter completed orders
  const completedOrders = Object.values(orders).filter(order => order.status === 'completed');
  const completedOrderCount = completedOrders.length;

  // Filter pending orders
  const pendingOrders = Object.values(orders).filter(order => order.status !== 'completed');
  const pendingOrderCount = pendingOrders.length;

  // Update the HTML with the total number of completed and pending orders
  totalCompletedElement.innerText = `${completedOrderCount}`;
  totalPendingElement.innerText = `${pendingOrderCount}`;
});

function signOut() {
  // Perform any sign-out logic here (e.g., clearing session, etc.)

  // Redirect to the login page
  window.location.href = "login.html";
}

// Attach click event listener to the link
document.getElementById("signOutLink").addEventListener("click", signOut);