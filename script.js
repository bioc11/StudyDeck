let decks = [];
let currentDeck = null;

// -----------------------------
// LOAD DECKS
// -----------------------------
async function loadDecks() {
    const deckFiles = [
        "data/csharp.json",
        "data/javascript.json"
    ];

    const promises = deckFiles.map(async file => {
        let response = await fetch(file);
        return await response.json();
    });

    decks = await Promise.all(promises);
    renderDeckList();
}

// -----------------------------
// RENDER DECK SELECTION
// -----------------------------
function renderDeckList() {
    const main = document.getElementById("cardsContainer");
    const search = document.getElementById("searchBox");
    const back = document.getElementById("backBtn");
    const title = document.getElementById("headerTitle");

    search.style.display = "none";
    back.style.display = "none";
    title.textContent = "Study Deck";

    main.innerHTML = `
        <div class="deck-list">
            ${decks.map((deck, i) => `
                <div class="deck-card" onclick="openDeck(${i})">
                    <h2>${deck.title}</h2>
                    <p>${deck.description}</p>
                </div>
            `).join("")}
        </div>
    `;
}

// -----------------------------
// OPEN A DECK
// -----------------------------
function openDeck(index) {
    currentDeck = decks[index];

    const title = document.getElementById("headerTitle");
    const search = document.getElementById("searchBox");
    const back = document.getElementById("backBtn");

    title.textContent = currentDeck.title;
    search.value = "";
    search.style.display = "inline-block";
    back.style.display = "inline-block";

    renderCards(currentDeck.cards);
}

// -----------------------------
// DISPLAY CARDS
// -----------------------------
function renderCards(list) {
    const main = document.getElementById("cardsContainer");
    main.innerHTML = "";

    list.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="question">${index + 1}. ${item.question}</div>
            <div class="answer">${item.answer || "<i>No answer yet.</i>"}</div>
        `;

        card.addEventListener("click", () => {
            card.classList.toggle("open");
        });

        main.appendChild(card);
    });
}

// -----------------------------
// SEARCH INSIDE DECK
// -----------------------------
document.getElementById("searchBox").addEventListener("input", function () {
    if (!currentDeck) return;

    const text = this.value.toLowerCase();

    const filtered = currentDeck.cards.filter(q =>
        q.question.toLowerCase().includes(text) ||
        q.answer.toLowerCase().includes(text)
    );

    renderCards(filtered);
});

// -----------------------------
// BACK BUTTON
// -----------------------------
document.getElementById("backBtn").addEventListener("click", () => {
    currentDeck = null;
    renderDeckList();
});

// -----------------------------
// DARK MODE
// -----------------------------
const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const darkMode = document.body.classList.contains("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    toggleBtn.textContent = darkMode ? "☀️" : "🌙";
});

// -----------------------------
// INITIAL LOAD
// -----------------------------
loadDecks();
