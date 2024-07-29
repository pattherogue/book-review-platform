document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value;
    fetch(`/api/cart/add?search=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = ''; // Clear previous results
            data.forEach(book => {
                const div = document.createElement('div');
                div.textContent = `${book.title} - $${book.price}`;
                resultsContainer.appendChild(div);
            });
        })
        .catch(error => console.error('Error fetching search results:', error));
});
