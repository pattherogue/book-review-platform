function searchBooks() {
    const searchTerm = document.getElementById('searchTerm').value;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyB-ihBh7hsTBoFXtN86YaGtVrHaqKL0SWU`)
        .then(response => response.json())
        .then(data => {
            const results = document.getElementById('results');
            results.innerHTML = '';
            data.items.forEach(item => {
                const bookInfo = item.volumeInfo;
                const bookElement = document.createElement('div');
                bookElement.innerHTML = `
                    <h3>${bookInfo.title}</h3>
                    <p>${bookInfo.authors ? bookInfo.authors.join(', ') : 'No author information'}</p>
                    <button onclick="addBookToCart('${bookInfo.title}', '${item.id}')">Add to Cart</button>
                `;
                results.appendChild(bookElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

function addBookToCart(title, bookId) {
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
