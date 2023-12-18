// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue, remove, set } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

function tableOrders() {
  const orderTableContainer = document.getElementById('orderTable');

  if (!orderTableContainer) {
    console.error("Table container not found");
    return;
  }

  const ordersRef = ref(db, "orders");

  orderTableContainer.innerHTML = ""; // Clear the container

  const userOrdersMap = new Map();

  onValue(ordersRef, (snapshot) => {
    snapshot.forEach((order) => {
      const orderData = order.val();
      const userId = orderData.userId;
      const productId = orderData.productId;
      const quantity = orderData.quantity;
      const orderId = order.key;

      // Fetch user name based on userId
      getUserData(userId, (userData) => {
        const userName = `${userData.firstname} ${userData.lastname}`;

        // Check if the user already has an array to store orders
        if (!userOrdersMap.has(userId)) {
          userOrdersMap.set(userId, []);
        }

        // Check if an order with the same product ID exists for the user
        const existingOrderIndex = userOrdersMap.get(userId).findIndex((existingOrder) => existingOrder.productId === productId);

        if (existingOrderIndex !== -1) {
          // If the order with the same product ID exists, update the quantity
          userOrdersMap.get(userId)[existingOrderIndex].quantity += quantity;
        } else {
          // Otherwise, create a new order
          getOrderData(productId, (productData) => {
            userOrdersMap.get(userId).push({
              productId,
              orderId,
              productName: productData.name,
              quantity,
              status: orderData.status
            });

            // Check if all orders for the user have been processed
            if (userOrdersMap.get(userId).length === userOrdersCount(userId, snapshot)) {
              displayUserOrders(userId, userName, userOrdersMap.get(userId));
            }
          });
        }
      });
    });
  });
}

function userOrdersCount(userId, snapshot) {
  let count = 0;
  snapshot.forEach((order) => {
    if (order.val().userId === userId) {
      count++;
    }
  });
  return count;
}

function displayUserOrders(userId, userName, orders) {
  const orderTableContainer = document.getElementById('orderTable');

  // Create HTML table for user's name
  const userNameTable = document.createElement('table');
  userNameTable.classList.add('table', 'table-bordered', 'table-striped');
  userNameTable.innerHTML = `
    <thead class="thead-dark">
      <tr>
        <th scope="col">User Name</th>
        <th scope="col">User ID</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${userName}</td>
        <td>${userId}</td>
      </tr>
    </tbody>
  `;

  // Create HTML table for user's orders
  const userOrderTable = document.createElement('table');
  userOrderTable.classList.add('table', 'table-bordered', 'table-striped');
  userOrderTable.innerHTML = `
    <thead class="thead-dark">
      <tr>
        <th scope="col">Product Name</th>
        <th scope="col">Quantity</th>
        <th scope="col">Status</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2"></td>
        <td>
          <select class="statusDropdown form-control" data-userId="${userId}">
            <option value="pending" ${orders.every(order => order.status === 'pending') ? 'selected' : ''}>Pending</option>
            <option value="completed" ${orders.every(order => order.status === 'completed') ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td>
          <button class="btn btn-primary updateButton" data-userId="${userId}">Update</button>
          <button class="btn btn-danger deleteAllButton" data-userId="${userId}">Delete All</button>
        </td>
      </tr>
    </tfoot>
  `;

  const userNameTbody = userNameTable.querySelector('tbody');
  const tbody = userOrderTable.querySelector('tbody');
  const tfoot = userOrderTable.querySelector('tfoot');

  // Append user's name table and user's orders table to the container
  orderTableContainer.appendChild(userNameTable);
  orderTableContainer.appendChild(userOrderTable);

  // Populate the user's orders table
  orders.forEach((order) => {
    const { orderId, productName, quantity, status } = order;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${productName}</td>
      <td>${quantity}</td>
      <td></td>
      <td></td>
    `;

    tbody.appendChild(row);
  });

  // Add event listener for update button
  const updateButton = tfoot.querySelector('.updateButton');
  updateButton.addEventListener('click', async function () {
    const statusDropdown = tfoot.querySelector('.statusDropdown');
    const newStatus = statusDropdown.value;

    // Handle the update action for all orders of the user
    await Promise.all(orders.map(async (order) => {
      const orderId = order.orderId;
      // Update the status in the database
      await set(ref(db, `orders/${orderId}/status`), newStatus);
    }));
  });

  // Add event listener for delete all button
  const deleteAllButton = tfoot.querySelector('.deleteAllButton');
  deleteAllButton.addEventListener('click', async function () {
    // Handle the delete action for all orders of the user
    await Promise.all(orders.map(async (order) => {
      const orderId = order.orderId;
      await remove(ref(db, `orders/${orderId}`));
    }));
    // Remove the entire user order table after deletion
    userOrderTable.remove();
    userNameTable.remove();
  });
}

function getOrderData(productId, callback) {
  const productsRef = ref(db, `products/${productId}`); // Assuming you have a "products" node in your database

  onValue(productsRef, (snapshot) => {
    if (snapshot.exists()) {
      const productData = snapshot.val();
      callback(productData);
    } else {
      console.error(`Product with ID ${productId} not found`);
    }
  });
}

function getUserData(userId, callback) {
  const userRef = ref(db, `users/${userId}`);

  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      callback(userData);
    } else {
      console.error(`User with ID ${userId} not found`);
    }
  });
}

window.addEventListener('load', tableOrders);
