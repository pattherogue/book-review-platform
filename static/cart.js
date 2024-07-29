function fetchCart() {
    fetch('/api/cart/userId') // Assuming 'userId' is known or globally available
        .then(response => response.json())
        .then(data => {
            const cartContainer = document.getElementById('cartItems');
            cartContainer.innerHTML = ''; // Clear previous items
            data.forEach(item => {
                const div = document.createElement('div');
                div.textContent = `${item.quantity} x ${item.book.title} - $${item.book.price}`;
                cartContainer.appendChild(div);
            });
        })
        .catch(error => console.error('Error fetching cart:', error));
}

// Call fetchCart on page load to display the items
document.addEventListener('DOMContentLoaded', fetchCart);
