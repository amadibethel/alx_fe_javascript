const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API URL

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

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("syncNotification");

// Show random quote based on selected category filter
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;

  // Save last quote to session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add new quote from form inputs
async function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuoteText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newQuoteText || !newCategory) {
    alert("Please fill in both quote text and category.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");

  // Post new quote to server
  const postResult = await postQuoteToServer(newQuote);
  if (postResult) {
    showNotification("New quote synced to server.");
  }

  // Update displayed quote
  showRandomQuote();
}

// Populate categories dropdown dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))].sort();
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem("selectedCategory");
  if (lastCategory && [...categoryFilter.options].some(opt => opt.value === lastCategory)) {
    categoryFilter.value = lastCategory;
  }
}

// Filter quotes based on category selected and save to localStorage
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Notification helper
function showNotification(message, isError = false) {
  notification.textContent = message;
  notification.style.display = "block";
  notification.style.color = isError ? "red" : "green";
  setTimeout(() => {
    notification.style.display = "none";
    notification.style.color = "green"; // reset color
  }, 4000);
}

// Fetch quotes from mock server (simulate)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    // Simulate server quotes by mapping first 5 posts
    return data.slice(0, 5).map(post => ({
      text: post.title,
      category: "server"
    }));
  } catch (error) {
    console.error("Failed to fetch from server:", error);
    return [];
  }
}

// Post new quote to mock server (simulate)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    if (!response.ok) throw new Error("Post failed");
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to post quote:", error);
    showNotification("Failed to sync new quote to server.", true);
    return null;
  }
}

// Sync quotes: fetch from server, post local-only quotes, resolve conflicts
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Find local quotes not on server and post them
    const localOnlyQuotes = quotes.filter(
      localQ => !serverQuotes.some(serverQ => serverQ.text === localQ.text)
    );
    for (const quote of localOnlyQuotes) {
      await postQuoteToServer(quote);
    }

    // Find server quotes not in local and add them
    const newServerQuotes = serverQuotes.filter(
      serverQ => !quotes.some(localQ => localQ.text === serverQ.text)
    );

    if (newServerQuotes.length > 0) {
      quotes.push(...newServerQuotes);
      saveQuotes();
      populateCategories();
      showNotification(`${newServerQuotes.length} new quote(s) synced from server.`);
      showRandomQuote();
    }
  } catch (error) {
    console.error("Sync error:", error);
    showNotification("Sync failed. Check your connection.", true);
  }
}

// Create form dynamically for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = ""; // Clear before adding

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

// Initialize the app
function initializeApp() {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();

  // Show last selected category or default
  const lastCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = lastCategory;

  // Show last viewed quote or random quote
  const lastQuoteStr = sessionStorage.getItem("lastQuote");
  if (lastQuoteStr) {
    const lastQuote = JSON.parse(lastQuoteStr);
    quoteDisplay.innerHTML = `"${lastQuote.text}" — <strong>[${lastQuote.category}]</strong>`;
  } else {
    showRandomQuote();
  }

  // Set event listeners
  newQuoteButton.addEventListener("click", showRandomQuote);
  categoryFilter.addEventListener("change", filterQuotes);

  // Start syncing every 15 seconds
  setInterval(syncQuotes, 15000);
}

// Run the app
initializeApp();
