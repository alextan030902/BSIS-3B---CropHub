var loginButton = document.getElementById('loginButton');

    // Add a click event listener to the button
    loginButton.addEventListener('click', function() {
        // Redirect to another HTML file
        window.location.href = 'signup.html';
    });

    // Search Function
    function submitForm(event) {
        event.preventDefault(); // Prevents the default form submission
        var searchInputValue = document.getElementById('searchInput').value;
        alert('Search query: ' + searchInputValue);
        // You can perform additional actions here, such as sending the search query to a server.
    }