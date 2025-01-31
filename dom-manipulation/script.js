// Retrieve saved quotes from localStorage if available
const savedQuotes = JSON.parse(localStorage.getItem("quotes"));
const quotes = savedQuotes || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "The best way to predict your future is to create it.", category: "Success" },
    { text: "It does not matter how slowly you go as long as you do not stop.", category: "Perseverance" }
];

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;

    // Save the last viewed quote to sessionStorage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = {
            text: newQuoteText,
            category: newQuoteCategory
        };

        // Add the new quote to the array and save to localStorage
        quotes.push(newQuote);
        saveQuotes();

        // Reset input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        alert("New quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Function to create the form dynamically for adding a quote
function createAddQuoteForm() {
    const formContainer = document.createElement("div");

    const inputText = document.createElement("input");
    inputText.id = "newQuoteText";
    inputText.type = "text";
    inputText.placeholder = "Enter a new quote";

    const inputCategory = document.createElement("input");
    inputCategory.id = "newQuoteCategory";
    inputCategory.type = "text";
    inputCategory.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.onclick = addQuote;

    formContainer.appendChild(inputText);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
}

// Function to export quotes to a JSON file
function exportToJson() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Call the function to create the form when the page loads
createAddQuoteForm();

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Add event listener for export and import buttons
document.getElementById("exportButton").addEventListener("click", exportToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// If there's a last viewed quote in sessionStorage, show it
const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
if (lastViewedQuote) {
    document.getElementById("quoteDisplay").innerHTML = `<p>"${lastViewedQuote.text}"</p><p>- ${lastViewedQuote.category}</p>`;
}
