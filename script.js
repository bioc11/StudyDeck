let decks = [];
let currentDeck = null;
let isStudyMode = false;
const studyBtn = document.getElementById("studyModeBtn");

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
    studyBtn.textContent = "🟨"; 
    studyBtn.style.display = "inline-block";
    isStudyMode = false;

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
            <div class="question">${marked.parse(`${index + 1}. ${item.question}`)}</div>
            <div class="answer">${item.answer ? marked.parse(item.answer) : "<i>No answer yet.</i>"}</div>
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
    document.getElementById("studyModeBtn").style.display = "none";
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

// -----------------------------
// STUDY MODE
// -----------------------------
let studyIndex = 0;
let showingAnswer = false;

studyBtn.addEventListener("click", () => {
    if (!isStudyMode) {
        startStudyMode();
    } else {
        exitStudyMode();
    }
});

function startStudyMode() {
    const main = document.getElementById("cardsContainer");
    isStudyMode = true;
    studyBtn.textContent = "📚";
    studyIndex = 0;
    showingAnswer = false;

    main.innerHTML = `
        <div id="studyCard" class="card">
            <div id="question"></div>
            <div id="answer" style="display:none;"></div>
        </div>

        <div class="study-controls">
            <button id="previousBtn">&lt; Previous</button>
            <button id="showBtn">Show Answer</button>
            <button id="nextBtn">Next &gt;</button>
        </div>
    `;

    loadStudyCard();

    document.getElementById("showBtn").addEventListener("click", () => {
        showingAnswer = !showingAnswer;
        loadStudyCard();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        studyIndex++;
        if (studyIndex >= currentDeck.cards.length) {
            studyIndex = 0; // loop
        }
        showingAnswer = false;
        loadStudyCard();
    });

    document.getElementById("previousBtn").addEventListener("click", () => {
        studyIndex--;
        if (studyIndex < 0) {
            studyIndex = currentDeck.cards.length - 1; // loop to last card
        }
        showingAnswer = false;
        loadStudyCard();
    });
}

function loadStudyCard() {
    const questionBox = document.getElementById("question");
    const answerBox = document.getElementById("answer");

    const card = currentDeck.cards[studyIndex];

    questionBox.innerHTML = marked.parse(card.question);
    answerBox.innerHTML = card.answer ? marked.parse(card.answer) : "<i>No answer yet.</i>";

    answerBox.style.display = showingAnswer ? "block" : "none";

    document.getElementById("showBtn").textContent =
        showingAnswer ? "Hide Answer" : "Show Answer";
}

function exitStudyMode() {
    isStudyMode = false;
    studyBtn.textContent = "🟨"; 
    renderCards(currentDeck.cards);
}