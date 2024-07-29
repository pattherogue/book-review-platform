document.addEventListener('DOMContentLoaded', fetchCartItems);

function fetchCartItems() {
    console.log('Fetching cart items...');
    const url = `/api/cart/defaultUser`;  // Assuming 'defaultUser' is your placeholder user ID
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(items => {
            console.log('Cart items fetched:', items);
            const loadingMessage = document.getElementById('loadingMessage');
            const cartContainer = document.getElementById('cartItems');

            if (loadingMessage) {
                console.log('Found loadingMessage element:', loadingMessage);
                loadingMessage.style.display = 'none';
            } else {
                console.error('loadingMessage element not found');
            }

            if (cartContainer) {
                console.log('Found cartItems element:', cartContainer);
                cartContainer.style.display = 'block';
                cartContainer.innerHTML = '';

                items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.innerHTML = `
                        <p>${item.title} - Quantity: ${item.quantity}</p>
                        <input type="number" value="${item.quantity}" id="quantity-${item.cart_id}">
                        <button onclick="editCartItem('${item.cart_id}', document.getElementById('quantity-${item.cart_id}').value)">Edit</button>
                        <button onclick="removeCartItem('${item.cart_id}')">Remove</button>
                    `;
                    cartContainer.appendChild(itemElement);
                });
            } else {
                console.error('cartItems element not found');
            }
        })
        .catch(error => {
            console.error('Error loading cart items:', error);
            alert("Error loading cart items: " + error.message);
        });
}

function editCartItem(cartId, newQuantity) {
    console.log(`Editing cart item ${cartId} with new quantity ${newQuantity}`);
    const url = `/api/cart/edit`;
    const data = {
        cart_id: cartId,
        quantity: newQuantity
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update cart item');
            }
            return response.json();
        })
        .then(result => {
            console.log('Cart item updated:', result);
            fetchCartItems();  // Refresh cart items
        })
        .catch(error => {
            console.error('Error updating cart item:', error);
            alert("Error updating cart item: " + error.message);
        });
}

function removeCartItem(cartId) {
    console.log(`Removing cart item ${cartId}`);
    const url = `/api/cart/${cartId}`;

    fetch(url, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to remove cart item');
            }
            return response.json();
        })
        .then(result => {
            console.log('Cart item removed:', result);
            fetchCartItems();  // Refresh cart items
        })
        .catch(error => {
            console.error('Error removing cart item:', error);
            alert("Error removing cart item: " + error.message);
        });
}
