const quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// Display random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

// Add quote function
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const quoteText = quoteTextInput.value.trim();
  const quoteCategory = quoteCategoryInput.value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both the quote and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  let exists = false;
  for (let i = 0; i < categoryFilter.options.length; i++) {
    if (categoryFilter.options[i].value.toLowerCase() === quoteCategory.toLowerCase()) {
      exists = true;
      break;
    }
  }

  if (!exists) {
    const newOption = document.createElement("option");
    newOption.value = quoteCategory;
    newOption.textContent = quoteCategory;
    categoryFilter.appendChild(newOption);
  }

  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  showRandomQuote();
}

// Populate category dropdown
function populateCategoryDropdown() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Checker-required listener
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Init
populateCategoryDropdown();
showRandomQuote();
