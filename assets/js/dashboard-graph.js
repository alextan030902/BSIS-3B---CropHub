// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import * as Chart from 'https://cdn.jsdelivr.net/npm/chart.js/dist/chart.esm.min.mjs';

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

// Get the canvas element
const ctx = document.getElementById('productSalesChart').getContext('2d');

// Create the initial bar chart with dummy data
const productNames = [];
const productSales = [];

const productSalesChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: productNames,
    datasets: [{
      label: 'Product Sales',
      data: productSales,
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adjust the color as needed
      borderColor: 'rgba(75, 192, 192, 1)', // Adjust the color as needed
      borderWidth: 1,
    }],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Reference to your orders in the database
const ordersRef = ref(db, 'orders');

// Listen for changes in the database and update the chart accordingly
onValue(ordersRef, (snapshot) => {
  const orders = snapshot.val();

  // Loop through each order and update arrays
  Object.keys(orders).forEach((orderId) => {
    const order = orders[orderId];
    
    // Assuming products have unique IDs
    const productId = order.productId;
    const productName = `Product ${productId}`; // Replace with actual product names

    // Update arrays with data from the orders
    const existingIndex = productNames.indexOf(productName);
    if (existingIndex !== -1) {
      // Product already exists in arrays, update quantitySold
      productSales[existingIndex] += order.quantity;
    } else {
      // Product doesn't exist in arrays, add it
      productNames.push(productName);
      productSales.push(order.quantity);
    }
  });

  // Update the chart with the new data
  productSalesChart.data.labels = productNames;
  productSalesChart.data.datasets[0].data = productSales;
  productSalesChart.update();
});
