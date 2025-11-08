const questions = [
  {
    question:
      "А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.",
    answers: [
      { text: "Пол деревни, за раз", correct: false },
      {
        text: "Полдеревни, зараз",
        correct: true,
        explanation:
          "Правильно! Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз — это наречие, пишется слитно.",
      },
      { text: "Пол-деревни, за раз", correct: false },
    ],
  },
  {
    question: "А эти слова как пишутся?",
    answers: [
      { text: "Капуччино и эспрессо", correct: false },
      { text: "Каппуччино и экспресо", correct: false },
      {
        text: "Капучино и эспрессо",
        correct: true,
        explanation:
          "Конечно! По нормам русского языка правильно писать «капучино» и «эспрессо».",
      },
    ],
  },
  {
    question: "Как нужно писать?",
    answers: [
      { text: "Черезчур", correct: false },
      { text: "Черес-чур", correct: false },
      {
        text: "Чересчур",
        correct: true,
        explanation:
          "Да! Слово произошло от «через» и «чур». Пишется слитно — «чересчур».",
      },
    ],
  },
  {
    question: "Где допущена ошибка?",
    answers: [
      { text: "Аккордеон", correct: false },
      { text: "Белиберда", correct: false },
      {
        text: "Эпелепсия",
        correct: true,
        explanation: "Верно! Это слово пишется «эпИлепсия».",
      },
    ],
  },
];

// Перемешиваем порядок вопросов
const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

const quizArea = document.getElementById("quiz-area");
const endLabel = document.getElementById("end-label");
const stats = document.getElementById("stats");
let currentQuestion = 0;
let correctCount = 0;
let locked = false;
let answeredQuestions = [];

function showQuestion() {
  if (currentQuestion >= shuffledQuestions.length) {
    quizArea.innerHTML = "";
    endLabel.classList.remove("hidden");
    stats.classList.remove("hidden");
    stats.textContent = `Вы ответили правильно на ${correctCount} из ${shuffledQuestions.length}`;
    enableReviewMode();
    return;
  }

  const q = shuffledQuestions[currentQuestion];
  quizArea.innerHTML = "";

  const questionNumber = currentQuestion + 1;
  const qBlock = document.createElement("div");
  qBlock.className = "question";
  qBlock.innerHTML = `${questionNumber}) ${q.question} <span class="marker hidden" id="marker"></span>`;

  const aBlock = document.createElement("div");
  aBlock.className = "answers";

  const shuffledAnswers = q.answers.sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach((a) => {
    const btn = document.createElement("div");
    btn.className = "answer";
    btn.textContent = a.text;
    btn.onclick = () => selectAnswer(btn, a, qBlock, q);
    aBlock.appendChild(btn);
  });

  quizArea.appendChild(qBlock);
  quizArea.appendChild(aBlock);
}

function selectAnswer(element, answer, questionBlock, questionObj) {
  if (locked) return;
  locked = true;

  element.classList.add("selected");
  const marker = questionBlock.querySelector("#marker");
  const answers = document.querySelectorAll(".answer");

  // ⏳ небольшая пауза после выбора
  setTimeout(() => {
    // 🔹 Если ответ неправильный — все уезжают
    if (!answer.correct) {
      answers.forEach((a, i) => {
        setTimeout(() => {
          a.classList.add("slide-down");
        }, i * 250);
      });
    }

    // 🔹 Если ответ правильный — уезжают все, кроме выбранного
    else {
      answers.forEach((a, i) => {
        if (a !== element) {
          setTimeout(() => {
            a.classList.add("slide-down");
          }, i * 250);
        }
      });
    }

    const totalDelay = answers.length * 250 + 300;

    setTimeout(() => {
      if (answer.correct) {
        correctCount++;
        marker.textContent = "✅";
        marker.classList.remove("hidden");

        // Немного увеличиваем выбранный блок
        element.classList.add("grow");

        // Появляется пояснение
        const exp = document.createElement("div");
        exp.className = "explanation";
        exp.textContent = answer.explanation;
        element.appendChild(exp);
      } else {
        marker.textContent = "❌";
        marker.classList.remove("hidden");
      }

      setTimeout(() => {
        answeredQuestions.push({
          question: `${currentQuestion + 1}) ${questionObj.question}`,
          correctAnswer: questionObj.answers.find((a) => a.correct),
        });
        currentQuestion++;
        locked = false;
        showQuestion();
      }, 2500);
    }, totalDelay);
  }, 800);
}
function enableReviewMode() {
  answeredQuestions.forEach((item, i) => {
    const block = document.createElement("div");
    block.className = "question";
    block.textContent = item.question;
    block.style.cursor = "pointer";
    block.dataset.index = i;
    quizArea.appendChild(block);
  });

  quizArea.addEventListener("click", (e) => {
    if (!e.target.classList.contains("question")) return;

    document.querySelectorAll(".review-answer").forEach((el) => el.remove());

    const index = e.target.dataset.index;
    const data = answeredQuestions[index];

    const ans = document.createElement("div");
    ans.className = "explanation review-answer";
    ans.textContent = `✅ ${data.correctAnswer.text}. ${data.correctAnswer.explanation}`;

    e.target.insertAdjacentElement("afterend", ans);
  });
}

showQuestion();
