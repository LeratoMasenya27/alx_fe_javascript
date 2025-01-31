// Array to store quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Self" }
  ];
  
  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>"${quote.text}" - ${quote.category}</p>`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (quoteText && quoteCategory) {
      const newQuote = { text: quoteText, category: quoteCategory };
      quotes.push(newQuote);
      localStorage.setItem('quotes', JSON.stringify(quotes)); // Save to local storage
      showRandomQuote(); // Display the new quote
    } else {
      alert("Please enter both quote and category.");
    }
  }
  
  // Event listener for the Show New Quote button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Initialize the app by showing a random quote
  document.addEventListener("DOMContentLoaded", showRandomQuote);
  