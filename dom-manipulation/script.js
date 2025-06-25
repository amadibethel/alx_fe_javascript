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

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    filter.value = savedCategory;
    filterQuotes();
  }
}

function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (!filtered.length) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes in this category.";
    return;
  }
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

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
  } else {
    alert("Please fill in both fields.");
  }
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported!");
      } else {
        alert("Invalid JSON format");
      }
    } catch (err) {
      alert("Error reading file");
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
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await res.json();
  const serverQuotes = data.slice(0, 3).map(p => ({ text: p.title, category: "server" }));
  return serverQuotes;
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const newQuotes = serverQuotes.filter(sq => !quotes.some(lq => lq.text === sq.text));
  if (newQuotes.length) {
    quotes.push(...newQuotes);
    saveQuotes();
    populateCategories();
    document.getElementById("syncNotification").style.display = 'block';
    document.getElementById("syncNotification").textContent = `${newQuotes.length} new quote(s) synced from server.`;
    setTimeout(() => document.getElementById("syncNotification").style.display = 'none', 3000);
  }
}

function setupEventListeners() {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("exportBtn").addEventListener("click", exportQuotesToJson);
}

// Initialize
loadQuotes();
populateCategories();
setupEventListeners();

const last = sessionStorage.getItem("lastQuote");
if (last) {
  const quote = JSON.parse(last);
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
}

setInterval(syncQuotes, 10000);
