const sheetUrl = "https://script.google.com/macros/s/AKfycbxFRfPBNswQ4lK6IL9iFPUeRs4RxsFYhNzi87_o6j2mC7jb5ugGin89pHfYwsV5SxU/exec"; // Google Apps Script URL
let currentQuestion = 0;
let questions = [];

fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    questions = data;
    displayQuestion();
  });

function displayQuestion() {
  const box = document.getElementById("question-box");
  const q = questions[currentQuestion];

  box.innerHTML = `
    <p>${q.question}</p>
    ${q.options.map(option => `
      <label>
        <input type="radio" name="answer" value="${option}" />
        ${option}
      </label><br>
    `).join("")}
  `;

  document.getElementById("feedback").textContent = "";
}

document.getElementById("submit-btn").addEventListener("click", () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  const name = document.getElementById("student-name").value.trim();
  if (!selected || !name) {
    alert("Palun sisesta nimi ja vali vastus.");
    return;
  }

  const answer = selected.value;
  const correct = questions[currentQuestion].answer;

  // Kuvame tagasisidet
  const feedback = document.getElementById("feedback");
  feedback.textContent = answer === correct ? "Õige vastus!" : "Vale vastus. Õige on: " + correct;
  feedback.style.color = answer === correct ? "green" : "red";

  // Saadame vastuse Google Sheeti
  fetch(sheetUrl, {
    method: "POST",
    body: JSON.stringify({
      name: name,
      question: questions[currentQuestion].question,
      answer: answer,
      correctAnswer: correct,
      correct: answer === correct
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      document.getElementById("question-box").innerHTML = "<p>Oled vastanud kõikidele küsimustele!</p>";
      document.getElementById("submit-btn").style.display = "none";
    }
  }, 2000);
});
