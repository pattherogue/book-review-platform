function searchBooks() {
    const query = document.getElementById('searchQuery').value;
    const apiKey = 'your_google_books_api_key';
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => console.error('Error fetching data:', error));
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Clear previous results

    data.items.forEach(item => {
        const bookInfo = item.volumeInfo;
        const title = bookInfo.title;
        const div = document.createElement('div');
        const addButton = document.createElement('button');

        addButton.textContent = 'Add to Cart';
        addButton.onclick = () => addToCart(bookInfo.title, bookInfo.authors.join(', '));

        div.textContent = title + " - " + bookInfo.authors.join(', ');
        div.appendChild(addButton);
        resultsDiv.appendChild(div);
    });
}

function addToCart(title, authors) {
    fetch('/api/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: 'user_id_placeholder', // This should be dynamically set based on logged-in user
            book_title: title,
            authors: authors
        })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error adding book to cart:', error));
}

function viewCart() {
    // Assuming a user_id is available after login
    fetch(`/api/cart/${userId}`, { method: 'GET' })  // You need to have `userId` defined somewhere
        .then(response => response.json())
        .then(data => {
            const cartDiv = document.getElementById('cart');
            cartDiv.innerHTML = '';  // Clear previous cart items
            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.textContent = `${item.book_id}: ${item.quantity}`;
                cartDiv.appendChild(itemDiv);
            });
        })
        .catch(error => console.error('Error fetching cart:', error));
}
