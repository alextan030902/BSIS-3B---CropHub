// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQSCj2eOEIxGSVfRtbCMIQKzqORsZ-dks",
  authDomain: "newproject-db3b1.firebaseapp.com",
  databaseURL: "https://newproject-db3b1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "newproject-db3b1",
  storageBucket: "newproject-db3b1.appspot.com",
  messagingSenderId: "436296489551",
  appId: "1:436296489551:web:e22f77e5080ca9ec37a83a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ordersRef = ref(db, 'orders');
const productsRef = ref(db, 'products');

// Get the chart canvas and context
const ctx = document.getElementById('myChart').getContext('2d');

// Initialize an empty chart
let myChart;

// Listen for changes to the 'orders' node
onValue(ordersRef, (snapshot) => {
  const orderData = snapshot.val();

  if (orderData) {
    // Extract product quantities from orders
    const productQuantities = Object.keys(orderData).map(orderId => {
      const order = orderData[orderId];
      return { id: order.productId, quantity: order.quantity || 0 };
    });

    // Listen for changes to the 'products' node
    onValue(productsRef, (productSnapshot) => {
      const productData = productSnapshot.val();

      if (productData) {
        // Extract product names and create an array of objects with 'id' and 'name'
        const productNames = Object.keys(productData).map(productId => {
          return { id: productId, name: productData[productId].name };
        });

        // Update chart labels and datasets
        createOrUpdateChart(productNames, productQuantities);
      }
    });
  }
});

// Function to create/update the chart
function createOrUpdateChart(namesData, quantitiesData) {
  if (myChart) {
    // If the chart already exists, destroy it first
    myChart.destroy();
  }

  // Create a new chart
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: namesData.map(product => product.name),
      datasets: [{
        data: quantitiesData.map(order => order.quantity),
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 5

      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function signOut() {
  // Perform any sign-out logic here (e.g., clearing session, etc.)

  // Redirect to the login page
  window.location.href = "login.html";
}

// Attach click event listener to the link
document.getElementById("signOutLink").addEventListener("click", signOut);


