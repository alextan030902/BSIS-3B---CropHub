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

const ctx = document.getElementById('myChart').getContext('2d');

let myChart;

onValue(ordersRef, (snapshot) => {
  const orderData = snapshot.val();

  if (orderData) {
    const productQuantities = Object.keys(orderData).flatMap(orderId => {
      const orderDetails = orderData[orderId];
      const orderItems = Object.keys(orderDetails).map(itemId => {
        const item = orderDetails[itemId];
        return { id: item.productId, quantity: item.quantity || 0 };
      });
      return orderItems;
    });

    // Now, productQuantities contains an array of objects with id and quantity properties
    console.log(productQuantities);

    onValue(productsRef, (productSnapshot) => {
      const productData = productSnapshot.val();

      if (productData) {
        const productNames = Object.keys(productData).map(productId => {
          return { id: productId, name: productData[productId].name };
        });

        createOrUpdateChart(productNames, productQuantities);
      }
    });
  }
});

function createOrUpdateChart(namesData, quantitiesData) {
  if (myChart) {
    myChart.destroy();
  }

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
  window.location.href = "login.html";
}

document.getElementById("signOutLink").addEventListener("click", signOut);