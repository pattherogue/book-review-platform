function searchBooks() {
    const searchTerm = document.getElementById('searchTerm').value;
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedSearchTerm}&key=AIzaSyB-ihBh7hsTBoFXtN86YaGtVrHaqKL0SWU`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
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

function addBookToCart(title, bookId) {
    const userId = 'defaultUser'; // Example user ID
    const quantity = 1; // Default quantity

    fetch('/api/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, book_id: bookId, quantity: quantity })
    })
    .then(response => response.json())
    .then(data => alert(`${title} added to cart!`))
    .catch(error => console.error('Error adding book to cart:', error));
}
