document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) {
        console.error("Search form not found");
        return;
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = document.getElementById('searchTerm').value.trim();
        if (!searchTerm) {
            alert("Please enter a search term.");
            return;
        }
        searchBooks(searchTerm);
    });

    function searchBooks(searchTerm) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&key=AIzaSyD_7Frvq_7Hg-OBc63im5p4-cJGWuHK5hM`)
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
                    <button onclick="addBookToCart('${item.id}')">Add to Cart</button>
                `;
                results.appendChild(bookElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error: " + error.message);
        });
    }
    
});

function addBookToCart(bookId) {
    const url = '/api/cart/add';
    const data = {
        user_id: 'defaultUser',
        book_id: bookId,
        quantity: 1
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
