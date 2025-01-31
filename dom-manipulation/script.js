// Array to store quotes, either loaded from local storage or initialized
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Load a random quote from the quotes array
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Add a quote!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;

    // Save the last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to add a new quote to the array and local storage
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        showRandomQuote();  // Show the latest added quote
        document.getElementById("newQuoteText").value = '';
        document.getElementById("newQuoteCategory").value = '';
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Export quotes to a JSON file
function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initialize by showing a random quote if available or showing a default message
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote();

    // Add event listener for the Add Quote button
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);

    // Add event listener for the "Add Quote" button to add a quote
    document.querySelector('button[onclick="addQuote()"]').addEventListener('click', addQuote);

    // Add event listener for the Import button to import quotes from a file
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);

    // Optionally: Load and display the last viewed quote from session storage
    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        alert(`Last viewed quote: "${lastViewedQuote.text}"`);
    }
});
