let quotes = [];
const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API endpoint (replace with real one if needed)

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Load quotes from localStorage or default
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored
    ? JSON.parse(stored)
    : [
        { text: "The best way to predict the future is to invent it.", category: "inspiration" },
        { text: "Do not be afraid to give up the good to go for the great.", category: "motivation" },
        { text: "You miss 100% of the shots you don't take.", category: "sports" },
      ];
  saveQuotes(); // ensure default is saved
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Fetch quotes from server (mocked with JSONPlaceholder)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    // Map server data to quote format (simulate)
    // For demo: Let's pretend 'title' is text and 'body' is category
    const serverQuotes = data.slice(0, 10).map(item => ({
      text: item.title,
      category: item.body || "general",
    }));
    return serverQuotes;
  } catch (error) {
    showNotification("Error fetching from server: " + error.message);
    return [];
  }
}

// Post new quote to server (mocked with JSONPlaceholder)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
    if (!response.ok) throw new Error("Failed to post quote");
    const result = await response.json();
    return result; // returned server data (mocked)
  } catch (error) {
    showNotification("Error posting to server: " + error.message);
    return null;
  }
}

// Synchronize local quotes with server quotes
async function syncQuotes() {
  showNotification("Syncing quotes with server...");
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length === 0) {
    showNotification("No server data to sync.");
    return;
  }

  // Conflict resolution: Prefer server data, merge local quotes that don't exist on server
  // Here, simplistic approach: if local quote text not found on server, keep it
  const mergedQuotes = [...serverQuotes];
  quotes.forEach(localQ => {
    if (!serverQuotes.some(sq => sq.text === localQ.text)) {
      mergedQuotes.push(localQ);
    }
  });

  // Check if merged quotes differ from current local quotes (simple length or content check)
  const localStr = JSON.stringify(quotes);
  const mergedStr = JSON.stringify(mergedQuotes);

  if (localStr !== mergedStr) {
    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();
    showRandomQuote();
    showNotification("Quotes updated from server.");
  } else {
    showNotification("Quotes are up to date.");
  }
}

// Periodically sync every 60 seconds
setInterval(syncQuotes, 60000);

// Add a new quote, update local and server
async function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuoteText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newQuoteText || !newCategory) {
    alert("Please fill in both quote and category.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newCategory };

  // Add locally
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  categoryFilter.value = newCategory;
  saveSelectedCategory(newCategory);
  showRandomQuote();

  // Post to server
  const postResult = await postQuoteToServer(newQuote);
  if (postResult) {
    showNotification("Quote added and synced with server.");
  } else {
    showNotification("Quote added locally; server sync failed.");
  }

  textInput.value = "";
  categoryInput.value = "";
}

// Create form for adding quotes
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

// Populate categories dropdown dynamically
function populateCategories() {
  const categories = Array.from(new Set(quotes.map(q => q.category))).sort();
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

// Load last selected category
function loadSelectedCategory() {
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  } else {
    categoryFilter.value = "all";
  }
}

// Filter quotes based on category and update display
function filterQuotes() {
  const selected = categoryFilter.value;
  saveSelectedCategory(selected);
  showRandomQuote();
}

// Show notification message
function showNotification(message) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
}

// Show a random quote (filtered by selected category)
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

// Export quotes to JSON file
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

// Import quotes from JSON file input
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (!Array.isArray(importedData)) {
        alert("Invalid JSON format: Expected an array of quotes.");
        return;
      }
      // Validate each quote object
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

// Initialization
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
