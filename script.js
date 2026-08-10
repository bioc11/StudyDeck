let subjects = [];
let currentSubject = null;
let currentGroupPath = [];
let currentDeck = null;
let isStudyMode = false;
const studyBtn = document.getElementById("studyModeBtn");

// -----------------------------
// LOAD DECKS
// -----------------------------
async function loadSubjects() {
    const subjectFiles = [
        "data/csharp.json",
        "data/javascript.json",
        "data/grokkingAlgorithms.json",
        "data/EAP.json"
    ];

    try {
        const promises = subjectFiles.map(async file => {
            const response = await fetch(file);
            return await response.json();
        });

        subjects = await Promise.all(promises);
    } catch (e) {
        document.getElementById("cardsContainer").innerHTML =
            `<p style="padding:20px;color:red;">Failed to load subjects. Please refresh the page.</p>`;
        return;
    }

    renderSubjectList();
}

// -----------------------------
// RENDER SUBJECT SELECTION
// -----------------------------
function renderSubjectList() {
    const main = document.getElementById("cardsContainer");
    const search = document.getElementById("searchBox");
    const back = document.getElementById("backBtn");
    const home = document.getElementById("homeBtn");
    const title = document.getElementById("headerTitle");

    search.style.display = "none";
    back.style.display = "none";
    home.style.display = "none";
    studyBtn.style.display = "none";
    title.textContent = "Study Deck";

    main.innerHTML = `
        <div class="deck-list">
            ${subjects.map((subject, i) => `
                <div class="deck-card" onclick="openSubject(${i})">
                    <h2>${subject.subject}</h2>
                    <p>${subject.description}</p>
                </div>
            `).join("")}
        </div>
    `;
}

// -----------------------------
// OPEN A SUBJECT
// -----------------------------
function openSubject(index) {
    currentSubject = subjects[index];
    currentGroupPath = [];

    const title = document.getElementById("headerTitle");
    const back = document.getElementById("backBtn");
    const home = document.getElementById("homeBtn");

    title.textContent = currentSubject.subject;
    back.style.display = "inline-block";
    home.style.display = "inline-block";

    renderCurrentLevel();
}

function renderCurrentLevel() {
    const groups = getCurrentGroups();
    if (groups.length > 0) {
        renderGroupList(groups);
        return;
    }

    renderDeckList(getCurrentDecks());
}

function getCurrentGroups() {
    if (!currentSubject) return [];

    if (currentGroupPath.length === 0) {
        return currentSubject.groups || [];
    }

    const activeGroup = currentGroupPath[currentGroupPath.length - 1];
    return activeGroup.groups || [];
}

function getCurrentDecks() {
    if (!currentSubject) return [];

    if (currentGroupPath.length === 0) {
        return currentSubject.decks || [];
    }

    const activeGroup = currentGroupPath[currentGroupPath.length - 1];
    return activeGroup.decks || [];
}

function getCurrentTitle() {
    if (!currentSubject) return "Study Deck";

    const chain = [currentSubject.subject, ...currentGroupPath.map(group => group.title)];
    return chain.join(" > ");
}

function openGroup(index) {
    const groups = getCurrentGroups();
    const selectedGroup = groups[index];
    if (!selectedGroup) return;

    currentGroupPath.push(selectedGroup);
    renderCurrentLevel();
}

function renderGroupList(groups) {
    const main = document.getElementById("cardsContainer");
    const search = document.getElementById("searchBox");
    const title = document.getElementById("headerTitle");

    search.style.display = "none";
    studyBtn.style.display = "none";
    title.textContent = getCurrentTitle();

    main.innerHTML = `
        <div class="deck-list">
            ${groups.map((group, i) => `
                <div class="deck-card" onclick="openGroup(${i})">
                    <h2>${group.title}</h2>
                    <p>${group.description || ""}</p>
                </div>
            `).join("")}
        </div>
    `;
}

// -----------------------------
// RENDER DECK SELECTION
// -----------------------------
function renderDeckList(decks) {
    const main = document.getElementById("cardsContainer");
    const search = document.getElementById("searchBox");
    const title = document.getElementById("headerTitle");

    search.style.display = "none";
    studyBtn.style.display = "none";
    title.textContent = getCurrentTitle();

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
async function openDeck(index) {
    const decks = getCurrentDecks();
    currentDeck = decks[index];
    if (!currentDeck) return;

    if (currentDeck.dataFile && (!currentDeck.cards || currentDeck.cards.length === 0)) {
        const response = await fetch(currentDeck.dataFile);
        const data = await response.json();
        currentDeck.cards = data.cards.filter(c => c.question);
    }

    const title = document.getElementById("headerTitle");
    const search = document.getElementById("searchBox");
    const back = document.getElementById("backBtn");

    title.textContent = getCurrentTitle() + " > " + currentDeck.title;
    search.value = "";
    search.style.display = "inline-block";
    back.style.display = "inline-block";

    studyBtn.style.display = "inline-block";
    studyBtn.textContent = "🟨";
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
        (q.answer && q.answer.toLowerCase().includes(text))
    );

    renderCards(filtered);
});

// -----------------------------
// BACK BUTTON
// -----------------------------
document.getElementById("backBtn").addEventListener("click", () => {
    if (currentDeck) {
        if (isStudyMode) exitStudyMode();
        currentDeck = null;
        renderCurrentLevel();
        return;
    }

    if (currentGroupPath.length > 0) {
        currentGroupPath.pop();
        renderCurrentLevel();
        return;
    }

    if (currentSubject) {
        currentSubject = null;
        currentGroupPath = [];
        renderSubjectList();
        return;
    }
});

document.getElementById("homeBtn").addEventListener("click", () => {
    if (currentDeck && isStudyMode) {
        exitStudyMode();
    }

    currentDeck = null;
    currentSubject = null;
    currentGroupPath = [];
    renderSubjectList();
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

// -----------------------------
// INITIAL LOAD
// -----------------------------
loadSubjects();
