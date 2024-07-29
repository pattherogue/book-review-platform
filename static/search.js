document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchTerm = document.getElementById('searchTerm');
    const results = document.getElementById('results');

    if (!searchForm || !searchTerm || !results) {
        console.error('One or more essential elements are missing on the page');
        return;
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchBooks();
    });

    function searchBooks() {
        const trimmedSearchTerm = searchTerm.value.trim();
        if (!trimmedSearchTerm) {
            alert('Please enter a search term.');
            return;
        }

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmedSearchTerm)}&key=AIzaSyD_7Frvq_7Hg-OBc63im5p4-cJGWuHK5hM`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                results.innerHTML = '';
                if (data.items) {
                    data.items.forEach(item => {
                        const bookInfo = item.volumeInfo;
                        const bookElement = document.createElement('div');
                        bookElement.innerHTML = `
                            <h3>${bookInfo.title}</h3>
                            <p>${bookInfo.authors ? bookInfo.authors.join(', ') : 'No author information'}</p>
                            <button onclick="addBookToCart('${item.id}')">Add to Cart</button>
                        `;
                        results.appendChild(bookElement);
                    });
                } else {
                    results.innerHTML = '<p>No results found</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error: " + error.message);
            });
    }

    function addBookToCart(bookId) {
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
});
