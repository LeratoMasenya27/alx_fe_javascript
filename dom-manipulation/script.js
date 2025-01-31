let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';

// Simulate fetching quotes from a mock API
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');  // Replace with actual mock API for quotes
        const data = await response.json();
        return data.map(post => ({
            text: post.title, 
            category: 'general', 
            id: post.id
        }));
    } catch (error) {
        console.error("Error fetching quotes from the server:", error);
        return [];
    }
}

// Simulate posting quotes to the server
async function postQuotesToServer(updatedQuotes) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedQuotes)  // Send quotes as JSON
        });

        if (!response.ok) {
            throw new Error('Failed to sync quotes to the server');
        }

        const data = await response.json();
        console.log("Quotes successfully posted to server", data);
    } catch (error) {
        console.error("Error posting quotes to the server:", error);
    }
}

// Sync local data with server data
async function syncQuotes() {
    try {
        // Fetch quotes from server
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

        // Resolve conflicts and merge quotes
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

        // Update local storage with merged quotes
        localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
        console.log("Data synced with server.");

        // Post updated quotes to the server
        await postQuotesToServer(updatedQuotes);

        // Optionally, update the UI
        displayQuotes(updatedQuotes);

        // Show alert after successful sync
        alert("Quotes synced with server!");
    } catch (error) {
        console.error("Failed to sync quotes:", error);
    }
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
    syncQuotes();  // Trigger sync manually
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
    setInterval(syncQuotes, 5 * 60 * 1000);  // Sync every 5 minutes
});
