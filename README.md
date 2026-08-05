# StudyDeck

StudyDeck is a browser-based flashcard app for structured self-study.
It is fully client-side and uses JSON files for subjects, decks, and cards.

## Features

- Subject selection view
- Deck selection inside each subject
- Flashcards with click-to-reveal answers
- Search inside the selected deck
- Study mode (next, previous, show/hide answer)
- Dark/light theme toggle
- Markdown support in questions and answers

## Run Locally

1. Clone the repository.
2. Open the project folder in VS Code.
3. Run with Live Server, or any static server.

Example with npx:

```bash
npx serve .
```

Then open the local URL shown in your terminal.

## Create Your Own Subjects And Decks

StudyDeck uses two layers of JSON files:

- Subject files in data (for example data/csharp.json)
- Deck card files in subfolders (for example data/Csharp/csharpBasics.json)

### 1. Create a deck card file

Create a new JSON file under a subject folder.

Example file: data/Math/algebra-basics.json

```json
{
  "title": "Algebra Basics",
  "description": "Foundations of algebra",
  "cards": [
    {
      "question": "What is a variable?",
      "answer": "A symbol that represents a value that can change."
    },
    {
      "question": "Solve: 2x + 3 = 11",
      "answer": "x = 4"
    }
  ]
}
```

### 2. Register the deck inside a subject file

Add an entry in a subject file under data.

Example file: data/math.json

```json
{
  "subject": "Math",
  "description": "Math topics for study",
  "decks": [
    {
      "title": "Algebra Basics",
      "description": "Core concepts and equations",
      "dataFile": "data/Math/algebra-basics.json",
      "cards": []
    }
  ]
}
```

Notes:

- dataFile must point to the deck card file path.
- cards can stay empty because cards are loaded from dataFile when the deck opens.

### 3. Register the subject in script.js

Open script.js and add the subject file to subjectFiles in loadSubjects.

Example:

```js
const subjectFiles = [
  "data/csharp.json",
  "data/javascript.json",
  "data/grokkingAlgorithms.json",
  "data/math.json"
];
```

Once this is done, your new subject and decks appear in the app.

## Card Format Rules

- Each card should include question.
- answer is optional, but recommended.
- Markdown is supported in both question and answer.

Minimal card:

```json
{
  "question": "What is polymorphism?",
  "answer": "The ability to treat objects of different types through a common interface."
}
```

## Troubleshooting

- If a subject does not appear, confirm its file path is listed in subjectFiles.
- If a deck opens with no cards, confirm dataFile path and JSON validity.
- If rendering looks broken, validate JSON for missing commas or braces.

## Project Structure

```text
StudyDeck-main/
  data/
    csharp.json
    javascript.json
    grokkingAlgorithms.json
    Csharp/
      csharpBasics.json
    Javascript/
      jsFundamentals.json
    Algorithms/
      algorithmsCh1.json
  index.html
  script.js
  styles.css
```
