// Fetch questions from JSON file
fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        window.questions = data; // store globally
        displayCards(data);
    });

// Display flashcards
function displayCards(list) {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    list.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="question">${index + 1}. ${item.question}</div>
            <div class="answer">${item.answer || "<i>No answer yet.</i>"}</div>
        `;

        // Toggle answer on click
        card.addEventListener("click", () => {
            card.classList.toggle("open");
        });

        container.appendChild(card);
    });
}

// Search functionality
document.getElementById("searchBox").addEventListener("input", function() {
    const text = this.value.toLowerCase();

    const filtered = window.questions.filter(q =>
        q.question.toLowerCase().includes(text) ||
        q.answer.toLowerCase().includes(text)
    );

    displayCards(filtered);
});

// DARK MODE toggle
const toggleBtn = document.getElementById("themeToggle");

// Load saved preference
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const darkModeEnabled = document.body.classList.contains("dark");

    // Save preference
    localStorage.setItem("theme", darkModeEnabled ? "dark" : "light");

    toggleBtn.textContent = darkModeEnabled ? "☀️" : "🌙";
});
