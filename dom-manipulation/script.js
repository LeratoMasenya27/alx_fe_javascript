let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';

// Simulate fetching quotes from a mock API (JSONPlaceholder for demonstration purposes)
function fetchQuotesFromServer() {
    return fetch('https://jsonplaceholder.typicode.com/posts')  // Replace with an actual mock API for quotes
        .then(response => response.json())
        .then(data => {
            return data.map(post => ({
                text: post.title, 
                category: 'general', 
                id: post.id
            }));
        });
}

// Sync local data with server data
function syncDataWithServer() {
    fetchQuotesFromServer().then(serverQuotes => {
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

        const updatedQuotes = serverQuotes.map(serverQuote => {
            const localQuote = localQuotes.find(q => q.id === serverQuote.id);
            if (localQuote && localQuote.text !== serverQuote.text) {
                console.log(`Conflict detected for quote ID ${serverQuote.id}: Resolving by taking server data.`);
                showConflictNotification(serverQuote.id);
            }
            return { ...localQuote, ...serverQuote };
        });

        const newQuotes = serverQuotes.filter(serverQuote => !localQuotes.some(q => q.id === serverQuote.id));
        updatedQuotes.push(...newQuotes);

        localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
        console.log("Data synced with server.");

        displayQuotes(updatedQuotes);
    }).catch(error => console.error("Failed to sync data with server:", error));
}

// Notify users when a conflict is resolved
function showConflictNotification(quoteId) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = `Conflict resolved for quote with ID ${quoteId}. Server data was taken.`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Manual sync button for users to trigger syncing with the server
document.getElementById('manualSyncButton').addEventListener('click', () => {
    syncDataWithServer();
});

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map(quote => quote.category))];

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
    categoryFilter.prepend(allOption);

    categoryFilter.value = lastSelectedCategory;
}

// Show quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    lastSelectedCategory = selectedCategory;
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    displayQuotes(filteredQuotes);
}

// Display quotes on the page
function displayQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = '';

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement("p");
        quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    filterQuotes();
    setInterval(syncDataWithServer, 5 * 60 * 1000);  // Sync every 5 minutes
});
