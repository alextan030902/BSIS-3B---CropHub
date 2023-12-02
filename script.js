var loginButton = document.getElementById('loginButton');

    // Add a click event listener to the button
    loginButton.addEventListener('click', function() {
        // Redirect to another HTML file
        window.location.href = 'signup.html';
    });

var checkoutButton = document.getElementById('checkoutButton');

    // Add a click event listener to the button
    checkoutButton.addEventListener('click', function() {
        // Redirect to another HTML file
        window.location.href = 'checkout.html';
    });    

    // Search Function
    function submitForm(event) {
        event.preventDefault(); // Prevents the default form submission
        var searchInputValue = document.getElementById('searchInput').value;
        alert('Search query: ' + searchInputValue);
        // You can perform additional actions here, such as sending the search query to a server.
    }

    // Search,Cart, Function
    


    var shoppingCart = (function () {

        cart = [];
    
        function Item(name, price, count) {
          this.name = name;
          this.price = price;
          this.count = count;
        }
    
        // Save cart
        function saveCart() {
          localStorage.setItem('shoppingCart', JSON.stringify(cart));
        }
    
        // Load cart
        function loadCart() {
          cart = JSON.parse(localStorage.getItem('shoppingCart'));
        }
        if (localStorage.getItem("shoppingCart") != null) {
          loadCart();
        }
    
    
        var obj = {};
    
        // Add to cart
        obj.addItemToCart = function (name, price, count) {
          for (var item in cart) {
            if (cart[item].name === name) {
              cart[item].count++;
              saveCart();
              return;
            }
          }
          var item = new Item(name, price, count);
          cart.push(item);
          saveCart();
        }
        // Set count from item
        obj.setCountForItem = function (name, count) {
          for (var i in cart) {
            if (cart[i].name === name) {
              cart[i].count = count;
              break;
            }
          }
        };
        // Remove item from cart
        obj.removeItemFromCart = function (name) {
          for (var item in cart) {
            if (cart[item].name === name) {
              cart[item].count--;
              if (cart[item].count === 0) {
                cart.splice(item, 1);
              }
              break;
            }
          }
          saveCart();
        }
    
        // Remove all items from cart
        obj.removeItemFromCartAll = function (name) {
          for (var item in cart) {
            if (cart[item].name === name) {
              cart.splice(item, 1);
              break;
            }
          }
          saveCart();
        }
    
        // Clear cart
        obj.clearCart = function () {
          cart = [];
          saveCart();
        }
    
        // Count cart 
        obj.totalCount = function () {
          var totalCount = 0;
          for (var item in cart) {
            totalCount += cart[item].count;
          }
          return totalCount;
        }
    
        // Total cart
        obj.totalCart = function () {
          var totalCart = 0;
          for (var item in cart) {
            totalCart += cart[item].price * cart[item].count;
          }
          return Number(totalCart.toFixed(2));
        }
    
        // List cart
        obj.listCart = function () {
          var cartCopy = [];
          for (i in cart) {
            item = cart[i];
            itemCopy = {};
            for (p in item) {
              itemCopy[p] = item[p];
            }
            itemCopy.total = Number(item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy)
          }
          return cartCopy;
        }
        return obj;
      })();
    
    
      
      // Add item
        document.querySelectorAll('.default-btn').forEach(function(btn) {
        btn.addEventListener('click', function(event) {
      // alert('working');
            event.preventDefault();
      var name = this.getAttribute('data-name');
      var price = Number(this.getAttribute('data-price'));
      shoppingCart.addItemToCart(name, price, 1);
      displayCart();
    });
  });
  
    
    //   // Clear items
    //   $('.clear-cart').click(function () {
    //     shoppingCart.clearCart();
    //     displayCart();
    //   });
    
    
      // Assuming shoppingCart and displayCart functions are defined elsewhere

// Attach event listener to the element with class 'show-cart'
document.querySelector('.show-cart').addEventListener('change', function (event) {
    // Get the name and count from the data attributes of the target element
    var name = event.target.getAttribute('data-name');
    var count = Number(event.target.value);

    // Call the setCountForItem function with the obtained values
    shoppingCart.setCountForItem(name, count);

    // Call the displayCart function to update the cart display
    displayCart();
});

// Call the displayCart function initially
displayCart();

// Define the displayCart function
function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";

    // Iterate over items in the cartArray
    for (var i in cartArray) {
        output += "<tr>" +
            "<td>" + cartArray[i].name + "</td>" +
            "<td>(" + cartArray[i].price + ")</td>" +
            "<td><div class='input-group'>" +
            "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>" +
            "</div></td>" +
            "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>" +
            " = " +
            "<td>" + cartArray[i].total + "</td>" +
            "</tr>";
    }

    // Update HTML content of elements with the specified classes
    document.querySelector('.show-cart').innerHTML = output;
    document.querySelector('.total-cart').innerHTML = shoppingCart.totalCart();
    document.querySelector('.total-count').innerHTML = shoppingCart.totalCount();
}

    
      // Delete item button
    
      document.querySelector('.show-cart').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-item')) {
            var name = event.target.getAttribute('data-name');
            shoppingCart.removeItemFromCartAll(name);
            displayCart();
        }
    });
    
      // Item count input
      document.querySelector('.show-cart').addEventListener('change', function(event) {
        if (event.target.classList.contains('item-count')) {
            var name = event.target.getAttribute('data-name');
            var count = Number(event.target.value);
            shoppingCart.setCountForItem(name, count);
            displayCart();
        }
    });
    
    displayCart();
    
    
    //////// ui script start /////////
    // Tabs Single Page
 // Add classes to tabs
var tabsContainer = document.querySelector('.tab ul.tabs');
if (tabsContainer) {
    tabsContainer.classList.add('active');

    var firstTab = tabsContainer.querySelector('li:eq(0)');
    if (firstTab) {
        firstTab.classList.add('current');
    }
}

// Handle tab click event
var tabLinks = document.querySelectorAll('.tab ul.tabs li a');
tabLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
        var tab = this.closest('.tab');
        var index = this.closest('li').index();

        // Remove 'current' class from all tabs
        var tabItems = tab ? tab.querySelectorAll('ul.tabs > li') : [];
        tabItems.forEach(function (tabItem) {
            tabItem.classList.remove('current');
        });

        // Add 'current' class to the clicked tab
        var closestLi = this.closest('li');
        if (closestLi) {
            closestLi.classList.add('current');
        }

        // Hide all tabs content except the clicked one
        var tabContentItems = tab ? tab.querySelectorAll('.tab_content div.tabs_item') : [];
        tabContentItems.forEach(function (tabContentItem, i) {
            tabContentItem.style.display = i === index ? 'block' : 'none';
        });

        event.preventDefault();
    });
});

// Search function
var searchField = document.getElementById('search_field');
if (searchField) {
    searchField.addEventListener('keyup', function () {
        var value = this.value.toLowerCase();
        var patt = new RegExp(value, 'i');

        var colElements = document.querySelectorAll('.tab_content .col-lg-3');
        colElements.forEach(function (table) {
            var featuredItem = table.querySelector('.featured-item');
            var featuredItemText = featuredItem ? featuredItem.textContent.toLowerCase() : '';

            if (!(featuredItemText.search(patt) >= 0)) {
                table.style.display = 'none';
            }

            if (table.textContent.toLowerCase().search(patt) >= 0) {
                table.style.display = 'block';
                document.getElementById('not_found').style.display = 'none';
            } else {
                document.getElementById('not_found').innerHTML = 'Product not found..';
                document.getElementById('not_found').style.display = 'block';
            }
        });
    });
}
