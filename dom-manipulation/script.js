let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored
    ? JSON.parse(stored)
    : [
        {
          text: "The best way to predict the future is to invent it.",
          category: "inspiration",
        },
        {
          text: "Do not be afraid to give up the good to go for the great.",
          category: "motivation",
        },
        {
          text: "You miss 100% of the shots you don't take.",
          category: "sports",
        },
    let quotes = [];

    // Load quotes from localStorage
    function loadQuotes() {
      const stored = localStorage.getItem('quotes');
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

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

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
    alert("Quote added successfully!");
  } else {
    alert("Please fill in both fields.");
  }
}

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

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
    }

    // Save quotes to localStorage
    function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');

    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
      sessionStorage.setItem('lastQuote', JSON.stringify(quote));
    }

    function addQuote() {
      const textInput = document.getElementById('newQuoteText');
      const categoryInput = document.getElementById('newQuoteCategory');

      const newQuote = textInput.value.trim();
      const newCategory = categoryInput.value.trim();

      if (newQuote && newCategory) {
        quotes.push({ text: newQuote, category: newCategory });
        textInput.value = '';
        categoryInput.value = '';
        saveQuotes();
        alert("Quotes imported successfully!");
        alert('Quote added successfully!');
      } else {
        alert("Invalid JSON format.");
        alert('Please fill in both fields.');
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Event Listeners
newQuoteButton.addEventListener("click", showRandomQuote);
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
document
  .getElementById("exportBtn")
  .addEventListener("click", exportQuotesToJson);

// Initialize app
loadQuotes();
createAddQuoteForm();

// Show last viewed quote from sessionStorage
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
}

    function createAddQuoteForm() {
      const formContainer = document.getElementById('formContainer');

      const quoteInput = document.createElement('input');
      quoteInput.id = 'newQuoteText';
      quoteInput.type = 'text';
      quoteInput.placeholder = 'Enter a new quote';

      const categoryInput = document.createElement('input');
      categoryInput.id = 'newQuoteCategory';
      categoryInput.type = 'text';
      categoryInput.placeholder = 'Enter quote category';

      const addButton = document.createElement('button');
      addButton.textContent = 'Add Quote';
      addButton.addEventListener('click', addQuote);

      formContainer.appendChild(quoteInput);
      formContainer.appendChild(categoryInput);
      formContainer.appendChild(addButton);
    }

    function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function(e) {
        try {
          const importedQuotes = JSON.parse(e.target.result);
          if (Array.isArray(importedQuotes)) {
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
          } else {
            alert('Invalid JSON format.');
          }
        } catch (err) {
          alert('Error reading JSON file.');
        }
      };
      fileReader.readAsText(event.target.files[0]);
    }

    function exportQuotesToJson() {
      const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quotes.json';
      link.click();
      URL.revokeObjectURL(url);
    }

    // Event Listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
    document.getElementById('exportBtn').addEventListener('click', exportQuotesToJson);

    // Initialize app
    loadQuotes();
    createAddQuoteForm();

    // Show last viewed quote from sessionStorage
    const lastQuote = sessionStorage.getItem('lastQuote');Add commentMore actions
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
    }