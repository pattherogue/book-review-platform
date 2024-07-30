document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) {
        console.error("Search form not found");
        return;
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = document.getElementById('searchTerm');
        if (!searchTerm || !searchTerm.value.trim()) {
            console.log("No search term entered.");
            alert("Please enter a search term.");
            return;
        }
        console.log("Search term entered:", searchTerm.value.trim());
        searchBooks(searchTerm.value.trim());
    });
});

function searchBooks(searchTerm) {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    console.log("Fetching books with search term:", searchTerm);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodedSearchTerm}&key=AIzaSyD_7Frvq_7Hg-OBc63im5p4-cJGWuHK5hM`)
    .then(response => {
        console.log("Response status:", response.status);
        if (response.status === 429) {
            console.error('Rate limit exceeded.');
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (!response.ok) {
            console.error('Failed to fetch books with status:', response.status);
            throw new Error('Failed to fetch books');
        }
        return response.json();
    })
    .then(data => {
        console.log("Data received:", data);
        const results = document.getElementById('results');
        if (!results) {
            console.error('Results container not found');
            return;
        }
        results.innerHTML = ''; // Clear previous results
        if (data.items && data.items.length > 0) {
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
            results.innerHTML = '<p>No results found.</p>';
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
        console.log("Attempt to add book to cart:", response);
        if (!response.ok) {
            console.error('Failed to add book to cart with status:', response.status);
            throw new Error('Failed to add book to cart');
        }
        return response.json();
    })
    .then(result => {
        console.log("Book added to cart:", result);
        alert("Book added to cart successfully!");
    })
    .catch(error => {
        console.error('Error adding book to cart:', error);
        alert("Error adding book to cart: " + error.message);
    });
}
