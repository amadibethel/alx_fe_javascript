let quotes = [];

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored
    ? JSON.parse(stored)
    : [
        { text: "The best way to predict the future is to invent it.", category: "inspiration" },
        { text: "Do not be afraid to give up the good to go for the great.", category: "motivation" },
        { text: "You miss 100% of the shots you don't take.", category: "sports" },
      ];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  
  // Clear previous categories but keep "All Categories"
  filter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // Restore saved category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    filter.value = savedCategory;
  }
}

function showRandomQuote() {
  const filter = document.getElementById("categoryFilter");
  const selectedCategory = filter.value;

  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function filterQuotes() {
  const filter = document.getElementById("categoryFilter");
  const selectedCategory = filter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuoteText = textInput.value.trim();
  const newQuoteCategory = categoryInput.value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();

  // Refresh categories and select the new quote's category
  populateCategories();
  document.getElementById("categoryFilter").value = newQuoteCategory;
  localStorage.setItem("selectedCategory", newQuoteCategory);

  showRandomQuote();

  alert("Quote added successfully!");

  textInput.value = "";
  categoryInput.value = "";
}

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

function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  // Map first 3 posts to quotes with category 'server'
  return data.slice(0, 3).map(post => ({
    text: post.title,
    category: "server"
  }));
}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    // Filter quotes not in local yet (by text)
    const newQuotes = serverQuotes.filter(
      sq => !quotes.some(lq => lq.text === sq.text)
    );

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      const notif = document.getElementById("syncNotification");
      notif.textContent = `${newQuotes.length} new quote(s) synced from server.`;
      notif.style.display = "block";
      setTimeout(() => { notif.style.display = "none"; }, 4000);
    }
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

function setupEventListeners() {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("exportBtn").addEventListener("click", exportQuotesToJson);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
}

// Initialize app
loadQuotes();
populateCategories();
setupEventListeners();

// Restore last quote from session storage
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
}

// Set last selected category from local storage and show a quote accordingly
filterQuotes();

// Periodically sync with server every 15 seconds
setInterval(syncQuotes, 15000);
