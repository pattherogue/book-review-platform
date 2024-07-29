function fetchCartItems() {
    const url = `/api/cart/defaultUser`;  // Assuming 'defaultUser' is your placeholder user ID
    fetch(url)
    .then(response => response.json())
    .then(items => {
        const cartContainer = document.getElementById('cartItems');
        cartContainer.innerHTML = ''; // Clear existing items
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <p>${item.title} - Quantity: ${item.quantity}</p>
                <input type="number" value="${item.quantity}" id="qty-${item.cart_id}">
                <button onclick="editCartItem('${item.cart_id}')">Edit</button>
                <button onclick="removeCartItem('${item.cart_id}')">Remove</button>
            `;
            cartContainer.appendChild(itemElement);
        });
    })
    .catch(error => console.error('Error loading cart items:', error));
}

function editCartItem(cartId) {
    const newQuantity = document.getElementById(`qty-${cartId}`).value;
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
            throw new Error('Failed to edit cart item');
        }
        return response.json();
    })
    .then(result => {
        console.log('Cart item updated:', result);
        alert("Cart item updated successfully!");
        fetchCartItems(); // Refresh the cart items
    })
    .catch(error => {
        console.error('Error updating cart item:', error);
        alert("Error updating cart item: " + error.message);
    });
}

function removeCartItem(cartId) {
    const url = `/api/cart/${cartId}`;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove cart item');
        }
        return response.json();
    })
    .then(result => {
        console.log('Cart item removed:', result);
        alert("Cart item removed successfully!");
        fetchCartItems(); // Refresh the cart items
    })
    .catch(error => {
        console.error('Error removing cart item:', error);
        alert("Error removing cart item: " + error.message);
    });
}
