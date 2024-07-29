function searchBooks() {
    console.log('Function searchBooks triggered');
    const searchTerm = document.getElementById('searchTerm').value;
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedSearchTerm}&key=AIzaSyB-ihBh7hsTBoFXtN86YaGtVrHaqKL0SWU`;

    console.log("Script loaded!");

    fetch(url)
    .then(response => {
        console.log('API response received');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data processed', data);
        const results = document.getElementById('results');
        if (data.items && data.items.length > 0) {
            results.innerHTML = data.items.map(book => {
                const volumeInfo = book.volumeInfo;
                return `<div>
                            <h3>${volumeInfo.title}</h3>
                            <p>${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'No authors available'}</p>
                            <button onclick="addBookToCart('${volumeInfo.title.replace(/'/g, "\\'")}', '${book.id}')">Add to Cart</button>
                        </div>`;
            }).join('');
        } else {
            results.innerHTML = '<p>No books found.</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = `<p>Error fetching books: ${error.message}</p>`;
    });
}

function addBookToCart(bookId, title) {
    console.log('Adding book to cart:', title, bookId);

    const url = '/api/cart/add';
    const data = {
        user_id: 'defaultUser', // This should be dynamically set based on your application's user system
        book_id: bookId,
        quantity: 1 // This can be adjusted if you have an input for quantity
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

