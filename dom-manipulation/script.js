let quotes = [];

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [
    { text: "The best way to predict the future is to invent it.", category: "inspiration" },
    { text: "Do not be afraid to give up the good to go for the great.", category: "motivation" },
    { text: "You miss 100% of the shots you don't take.", category: "sports" }
  ];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  } else {
    quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
  }
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToServer(newQuote); // Post to mock API
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added and sent to server!");
  } else {
    alert("Please fill in both fields.");
  }
}

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

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selectedCategory);
  showRandomQuote();
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
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

// Post new quote to mock API
function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then(res => res.json())
    .then(data => {
      console.log("Posted to server:", data);
    })
    .catch(() => {
      alert("Failed to post to server.");
    });
}

// Fetch quotes from server & resolve conflict
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then(res => res.json())
    .then(data => {
      const serverQuotes = data.map(post => ({
        text: post.title,
        category: "server"
      }));
      return serverQuotes;
    });
}

// Sync quotes with server (server wins on conflict)
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    quotes = [...serverQuotes]; // Server overrides all
    saveQuotes();
    populateCategories();
    notifyUser("Synced quotes from server (server data used).");
  });
}

// Notification in UI
function notifyUser(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "#e0ffe0";
  note.style.border = "1px solid green";
  note.style.padding = "10px";
  note.style.marginTop = "10px";
  note.style.fontWeight = "bold";
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 4000);
}

// Periodically sync every 60 seconds
setInterval(syncQuotes, 60000);

// Startup
window.onload = () => {
  loadQuotes();
  populateCategories();
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("exportBtn").addEventListener("click", exportQuotesToJson);
};

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    const newQuote = {
      text: newText,
      category: newCategory,
    };

    quotes.push(newQuote); // Add to array
    saveQuotes();          // Save to localStorage
    populateCategories();  // Update categories
    showRandomQuote();     // Immediately update DOM with a new quote

    // Clear input fields
    textInput.value = "";
    categoryInput.value = "";

    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

window.onload = () => {
  loadQuotes();
  populateCategories();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

  // Restore last quote
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
  }
};

