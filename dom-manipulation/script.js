let quotes = [];

// Load quotes from localStorage or initialize default quotes
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored
    ? JSON.parse(stored)
    : [
        { text: "The best way to predict the future is to invent it.", category: "inspiration" },
        { text: "Do not be afraid to give up the good to go for the great.", category: "motivation" },
        { text: "You miss 100% of the shots you don't take.", category: "sports" },
      ];
  saveQuotes(); // Ensure saved in localStorage if default used
}

// Save quotes array to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// UI references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Show a random quote filtered by category
function showRandomQuote() {
  let filteredQuotes = quotes;
  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for the selected category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add new quote from input fields
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuoteText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newQuoteText || !newCategory) {
    alert("Please fill in both quote and category.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newCategory });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  categoryFilter.value = newCategory;
  saveSelectedCategory(newCategory);

  showRandomQuote();

  showNotification("Quote added successfully!");
}

// Create form inputs and button to add quote dynamically
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

// Populate category filter dropdown dynamically from quotes array
function populateCategories() {
  const categories = Array.from(new Set(quotes.map(q => q.category))).sort();
  // Clear existing options except 'All Categories'
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

// Save selected category to localStorage
function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

// Load and apply last selected category from localStorage
function loadSelectedCategory() {
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  } else {
    categoryFilter.value = "all";
  }
}

// Filter quotes and update display when category changes
function filterQuotes() {
  const selected = categoryFilter.value;
  saveSelectedCategory(selected);
  showRandomQuote();
}

// Show notification message temporarily
function showNotification(message) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Export quotes as JSON file
function exportToJsonFile() {
  try {
    const jsonStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    alert("Failed to export quotes: " + error.message);
  }
}

// Import quotes from selected JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (!Array.isArray(importedData)) {
        alert("Invalid JSON format: Expected an array of quotes.");
        return;
      }
      // Validate quotes format
      for (const q of importedData) {
        if (typeof q.text !== "string" || typeof q.category !== "string") {
          alert("Invalid quote format in JSON.");
          return;
        }
      }
      quotes.push(...importedData);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      showNotification("Quotes imported successfully!");
    } catch (err) {
      alert("Error parsing JSON file: " + err.message);
    }
  };
  reader.readAsText(file);
}

// Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);

// Initialize app
loadQuotes();
createAddQuoteForm();
populateCategories();
loadSelectedCategory();
showRandomQuote();

// Show last viewed quote from sessionStorage (optional)
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
}
