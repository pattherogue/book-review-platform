function addBookToCart(title, bookId) {
    console.log('Adding book to cart:', title, bookId);

    const url = '/api/cart/add';
    const data = {
        user_id: 'defaultUser',  // This should be dynamically set based on your application's user system
        book_id: bookId,
        quantity: 1  // This can be adjusted if you have an input for quantity
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add book to cart');
        }
        return response.json();
    })
    .then(result => {
        console.log('Book added to cart:', result);
        alert("Book added to cart successfully!");
    })
    .catch(error => {
        console.error('Error adding book to cart:', error);
        alert("Error adding book to cart: " + error.message);
    });
}
