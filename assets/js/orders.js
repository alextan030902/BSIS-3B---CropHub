// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onValue, remove, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

async function tableOrders() {
  const orderTableContainer = document.getElementById('orderTable');

  if (!orderTableContainer) {
    console.error("Table container not found");
    return;
  }

  const ordersRef = ref(db, "orders");

  orderTableContainer.innerHTML = ""; // Clear the container

  try {
    const snapshot = await get(ordersRef);

    if (snapshot.exists()) {
      const ordersData = snapshot.val();

      // Flatten the nested structure into an array of orders
      const ordersArray = Object.keys(ordersData).reduce((acc, userId) => {
        const userOrders = ordersData[userId];
        Object.keys(userOrders).forEach(orderId => {
          acc.push({ userId, orderId, ...userOrders[orderId] });
        });
        return acc;
      }, []);

      const uniqueUserIds = [...new Set(ordersArray.map(order => order.userId))];

      for (const userId of uniqueUserIds) {
        const userOrders = ordersArray.filter(order => order.userId === userId);

        try {
          const userData = await getUserData(userId);

          if (userData) {
            const userName = `${userData.firstname} ${userData.lastname}`;
            const userOrdersMap = {};

            for (const order of userOrders) {
              const productId = order.productId;
              const quantity = order.quantity;
              const orderId = order.orderId;

              if (!userOrdersMap[productId]) {
                userOrdersMap[productId] = {
                  productId,
                  orderId,
                  productName: await getProductName(productId),
                  quantity,
                  status: order.status
                };
              } else {
                userOrdersMap[productId].quantity += quantity;
              }
            }

            displayUserOrders(userId, userName, Object.values(userOrdersMap));
           
            console.log('Orders loaded successfully for user:', userName);
          } else {
            // console.error(`User data for ID ${userId} is null or undefined`);
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching orders:", error.message);
  }
}

async function getProductName(productId) {
  const productsRef = ref(db, `products/${productId}`);
  try {
    const snapshot = await get(productsRef);

    if (snapshot.exists()) {
      return snapshot.val().name;
    } else {
      console.error(`Product with ID ${productId} not found`);
      return "";
    }
  } catch (error) {
    console.error("Error fetching product name:", error.message);
    return "";
  }
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

async function displayUserOrders(userId, userName, orders) {
  const orderTableContainer = document.getElementById('orderTable');

  // Create HTML table for user's name
  const userNameTable = document.createElement('table');
  userNameTable.classList.add('table', 'table-bordered', 'table-striped');
  userNameTable.innerHTML = `
    <thead class="thead-dark">
      <tr>
        <th scope="col">User Name</th>
        <th scope="col">User ID</th>
        <th scope="col">Total Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${userName}</td>
        <td>${userId}</td>
        <td class="totalPrice"></td>
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
        <td class="totalPriceCell"></td>
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

  // Fetch and display total cart price from user's database
  const userRef = ref(db, `users/${userId}`);
  onValue(userRef, (snapshot) => {
    const totalCartPriceCell = userNameTable.querySelector('.totalPrice');
    const totalCartPrice = snapshot.val() ? snapshot.val().totalCartPrice || 0 : 0;
    totalCartPriceCell.innerText = totalCartPrice;
  });

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

  // Check if the new status is "completed" before updating
  if (newStatus === 'completed') {
    try {
      // Update the status for each order in the existing array
      for (const order of Object.values(orders)) {
        const orderId = order.orderId;

        // Update the status in the database
        await set(ref(db, `orders/${orderId}/status`), newStatus);

        // Update the status directly within the orders array
        order.status = newStatus;
      }

      // Use a more user-friendly approach to display success messages
      console.log('Orders updated successfully for user:', userName);
    } catch (error) {
      console.error('Error updating orders:', error.message);
    }
  } else {
    // Display a message or handle the case when the status is not "completed"
    console.log('Please select "completed" status for updating orders.');
  }
});


  // // Add event listener for update button
  // const updateButton = tfoot.querySelector('.updateButton');
  // updateButton.addEventListener('click', async function () {
  //   const statusDropdown = tfoot.querySelector('.statusDropdown');
  //   const newStatus = statusDropdown.value;

  //   // Handle the update action for all orders of the user
  //   await Promise.all(orders.map(async (order) => {
  //     const orderId = order.orderId;
  //     // Update the status in the database
  //     await set(ref(db, `orders/${orderId}/status`), newStatus);
  //   }));
  //   // Use a more user-friendly approach to display success messages
  //   console.log('Orders updated successfully for user:', userName);
  // });

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
    // Use a more user-friendly approach to display success messages
    console.log('Orders deleted successfully for user:', userName);
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

async function getUserData(userId) {
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData;
    } else {
      // console.error(`User with ID ${userId} not found`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null;
  }
}

window.addEventListener('load', tableOrders);

function signOut() {
  // Perform any sign-out logic here (e.g., clearing session, etc.)

  // Redirect to the login page
  window.location.href = "login.html";
}

// Attach click event listener to the link
document.getElementById("signOutLink").addEventListener("click", signOut);
