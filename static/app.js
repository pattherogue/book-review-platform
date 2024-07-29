function addBookToCart() {
    const userId = document.getElementById('userId').value;
    const bookId = document.getElementById('bookId').value;
    const quantity = document.getElementById('quantity').value;

    fetch('/api/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, book_id: bookId, quantity: parseInt(quantity) })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}

function viewCart() {
    const userId = document.getElementById('viewUserId').value;
    fetch(`/api/cart/${userId}`)
    .then(response => response.json())
    .then(data => {
        const results = document.getElementById('cartResults');
        results.innerHTML = data.map(item => `<div>${item.book_id} - Quantity: ${item.quantity}</div>`).join('');
    })
    .catch(error => console.error('Error:', error));
}

function placeOrder() {
    const userId = document.getElementById('orderUserId').value;
    fetch(`/api/transaction/place`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}

