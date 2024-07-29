// Fetch and display cart items
function fetchCartItems() {
    const url = `/api/cart/defaultUser`; // Assuming 'defaultUser' is your placeholder user ID
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(items => {
            const cartContainer = document.getElementById('cartItems');
            cartContainer.innerHTML = ''; // Clear existing items
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.id = `cart-item-${item.cart_id}`;
                itemElement.innerHTML = `
                    <p>${item.title} - Quantity: ${item.quantity}</p>
                    <input type="number" value="${item.quantity}" id="quantity-${item.cart_id}">
                    <button onclick="editCartItem('${item.cart_id}')">Edit</button>
                    <button onclick="removeCartItem('${item.cart_id}')">Remove</button>
                `;
                cartContainer.appendChild(itemElement);
            });
        })
        .catch(error => {
            console.error('Error loading cart items:', error);
            alert("Error loading cart items: " + error.message);
        });
}

// Edit cart item quantity
function editCartItem(cartId) {
    const quantity = document.getElementById(`quantity-${cartId}`).value;
    const url = `/api/cart/edit`;
    const data = {
        cart_id: cartId,
        quantity: parseInt(quantity)
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
            console.log('Cart item edited:', result);
            alert("Cart item updated successfully!");
        })
        .catch(error => {
            console.error('Error editing cart item:', error);
            alert("Error editing cart item: " + error.message);
        });
}

// Remove cart item
function removeCartItem(cartId) {
    const url = `/api/cart/${cartId}`;
    fetch(url, {
        method: 'DELETE'
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
            // Remove the item from the DOM
            const itemElement = document.getElementById(`cart-item-${cartId}`);
            if (itemElement) {
                itemElement.remove();
            }
        })
        .catch(error => {
            console.error('Error removing cart item:', error);
            alert("Error removing cart item: " + error.message);
        });
}

// Call fetchCartItems to load cart items when the page loads
document.addEventListener('DOMContentLoaded', fetchCartItems);
