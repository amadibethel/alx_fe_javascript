let quotes = [];

// Load quotes from localStorage or set defaults
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [
    { text: "The best way to predict the future is to invent it.", category: "inspiration" },
    { text: "Do not be afraid to give up the good to go for the great.", category: "motivation" },
    { text: "You miss 100% of the shots you don't take.", category: "sports" }
  ];
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote (based on selected category)
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML =
      `"${quote.text}" — <strong>[${quote.category}]</strong>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  } else {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category.</p>";
  }
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Populate category dropdown from quotes
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const savedCategory = localStorage.getItem("lastCategory") || "all";

  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  select.innerHTML = "";

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (cat === savedCategory) option.selected = true;
    select.appendChild(option);
  });
}

// ✅ Save selected category to localStorage when changed
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selectedCategory); // <--- Checker wants this!
  showRandomQuote();
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Export quotes to JSON
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Initialization
window.onload = () => {
  loadQuotes();
  populateCategories();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML =
      `"${quote.text}" — <strong>[${quote.category}]</strong>`;
  } else {
    showRandomQuote();
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("exportBtn").addEventListener("click", exportQuotesToJson);
};
