window.onload = function() {
    fetchCartItems();
};

function fetchCartItems() {
    fetch('/api/cart/defaultUser') // Assuming 'defaultUser' is your user ID
    .then(response => response.json())
    .then(data => {
        const cartContainer = document.getElementById('cartItems');
        cartContainer.innerHTML = data.map(item => `
            <div>
                <h4>${item.book_id} - ${item.quantity}</h4>
                <input type="number" value="${item.quantity}" min="1" id="quantity-${item.book_id}" />
                <button onclick="updateCartItem('${item.book_id}')">Update</button>
                <button onclick="removeFromCart('${item.book_id}')">Remove</button>
            </div>
        `).join('');
    })
    .catch(error => console.error('Failed to fetch cart items:', error));
}

function updateCartItem(bookId) {
    const quantity = document.getElementById(`quantity-${bookId}`).value;
    fetch('/api/cart/edit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart_id: bookId, quantity: quantity })  // Ensure the API expects this format
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update cart item');
        }
        alert('Cart updated successfully!');
        fetchCartItems();  // Refresh the cart display
    })
    .catch(error => alert('Failed to update cart item: ' + error.message));
}

function placeOrder() {
    fetch('/api/transaction/place', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: 'defaultUser' })  // Adjust as necessary
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to place order');
        }
        return response.json();
    })
    .then(result => {
        alert('Order placed successfully!');
    })
    .catch(error => alert('Failed to place order: ' + error.message));
}
