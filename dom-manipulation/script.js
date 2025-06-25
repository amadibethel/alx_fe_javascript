let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" }
];

let lastCategory = localStorage.getItem("lastCategory") || "all";
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

window.onload = () => {
  populateCategories();
  document.getElementById("categoryFilter").value = lastCategory;
  filterQuotes();
};

// Show random quote
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  displayQuote(quote);
}

function displayQuote(quote) {
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = `<p><strong>${quote.text}</strong> — <em>${quote.category}</em></p>`;
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    alert("Quote added!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category filter
function populateCategories() {
  const unique = [...new Set(quotes.map(q => q.category))];
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = `<option value="all">All Categories</option>`;
  unique.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
}

// Filter quotes
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", category);
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length > 0) {
    displayQuote(filtered[0]);
  } else {
    document.getElementById("quoteDisplay").innerHTML = `<p>No quotes available in this category.</p>`;
  }
}

// Export JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

// Import JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON format.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // placeholder URL

// Periodic server sync (every 30 seconds)
setInterval(syncWithServer, 30000);

function syncWithServer() {
  fetch(serverUrl)
    .then(res => res.json())
    .then(data => {
      // Simulate server sending a new quote
      const newQuote = {
        text: data[Math.floor(Math.random() * data.length)].title,
        category: "Server"
      };

      // Check if the quote already exists (simple check)
      if (!quotes.find(q => q.text === newQuote.text)) {
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        notifyUser("New quote synced from server.");
      }
    })
    .catch(err => console.log("Sync error:", err));
}

function notifyUser(msg) {
  const note = document.createElement("div");
  note.style.background = "#e0f7fa";
  note.style.padding = "10px";
  note.style.margin = "10px 0";
  note.innerText = msg;
  document.body.insertBefore(note, document.getElementById("quoteDisplay"));
  setTimeout(() => note.remove(), 4000);
}
