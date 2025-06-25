let quotes = [];

// Load quotes from localStorage or default
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored
    ? JSON.parse(stored)
    : [
        { text: "The best way to predict the future is to invent it.", category: "inspiration" },
        { text: "Do not be afraid to give up the good to go for the great.", category: "motivation" },
        { text: "You miss 100% of the shots you don't take.", category: "sports" }
      ];
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuote = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newQuote && newCategory) {
    quotes.push({ text: newQuote, category: newCategory });
    textInput.value = "";
    categoryInput.value = "";
    saveQuotes();
    populateCategories(); // update filter options
    alert("Quote added successfully!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Create the quote addition form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
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

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
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

// Populate the category filter dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const currentValue = localStorage.getItem("lastCategory") || "all";
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  select.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (cat === currentValue) option.selected = true;
    select.appendChild(option);
  });
}

// Filter quotes by selected category
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", category);
  const filtered = category === "all"
    ? quotes
    : quotes.filter(q => q.category === category);

  if (filtered.length > 0) {
    quoteDisplay.innerHTML = `"${filtered[0].text}" — <strong>[${filtered[0].category}]</strong>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(filtered[0]));
  } else {
    quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
  }
}

// === Initialization ===
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
newQuoteButton.addEventListener("click", showRandomQuote);

document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("exportBtn").addEventListener("click", exportQuotesToJson);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

loadQuotes();
createAddQuoteForm();
populateCategories();
filterQuotes(); // show filtered quote or all

// Restore last viewed quote if exists
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
}

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", category); // Also handles requirement #2

  const filtered = category === "all"
    ? quotes
    : quotes.filter(q => q.category === category);

  if (filtered.length > 0) {
    quoteDisplay.innerHTML = `"${filtered[0].text}" — <strong>[${filtered[0].category}]</strong>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(filtered[0]));
  } else {
    quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
  }
}

document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

localStorage.setItem("lastCategory", category);

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const currentValue = localStorage.getItem("lastCategory") || "all";
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  select.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (cat === currentValue) option.selected = true;
    select.appendChild(option);
  });
}

populateCategories();
filterQuotes(); // shows filtered or all quotes based on lastCategory
