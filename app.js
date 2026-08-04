const STORAGE_KEY = "arEnnichiKitanProgressV4";

const questions = [
  {
    type: "quiz",
    destination: "D館へ向かえ",
    story: "最初の祭札は、高くそびえる建物の記憶に隠されている。",
    question: "D館は何階建て？",
    choices: ["6階建て", "7階建て", "8階建て", "9階建て"],
    answerIndex: 2,
    letter: "ず",
    image: "",
    imageAlt: "D館の現地写真"
  },
  {
    type: "quiz",
    destination: "図書館の正面入口へ向かえ",
    story: "本の眠る場所の前に、次の記憶が残されている。",
    question: "図書館の正面入口を出て、すぐ目の前にあるものは？",
    choices: ["駐車場", "駐輪場", "かみしんプラザ", "A館"],
    answerIndex: 1,
    letter: "い",
    image: "",
    imageAlt: "図書館正面入口の現地写真"
  },
  {
    type: "ar",
    destination: "G館の前へ向かえ",
    story: "G館の前に立つ謎のオブジェクトに、三つ目の祭札が隠されている。",
    question: "G館の前にある謎のオブジェクトをカメラに映そう！",
    letter: "こ",
    image: "./assets/images/g-object.jpg",
    imageAlt: "G館前の謎のオブジェクト",
    arPage: "./g-object-ar.html",
    arFlag: "g-object-ar-success"
  },
  {
    type: "ar",
    destination: "C館の入口へ向かえ",
    story: "最後の祭札は、C-Centerの看板に眠っている。カメラでその記憶を呼び起こせ。",
    question: "C館（C-Center）の看板をカメラに写してください。",
    letter: "う",
    image: "./assets/images/c-center.jpg",
    imageAlt: "C-Centerの看板",
    arPage: "./c-center-ar.html",
    arFlag: "c-center-ar-success"
  }
];

const screens = {
  intro: document.getElementById("introScreen"),
  question: document.getElementById("questionScreen"),
  reward: document.getElementById("rewardScreen"),
  final: document.getElementById("finalScreen"),
  clear: document.getElementById("clearScreen")
};

const progressText = document.getElementById("progressText");
const progressDots = document.getElementById("progressDots");
const stageLabel = document.getElementById("stageLabel");
const destination = document.getElementById("destination");
const stageStory = document.getElementById("stageStory");
const questionText = document.getElementById("questionText");
const choices = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const photoFrame = document.getElementById("photoFrame");
const stageImage = document.getElementById("stageImage");
const earnedLetter = document.getElementById("earnedLetter");
const rewardTitle = document.getElementById("rewardTitle");
const rewardMessage = document.getElementById("rewardMessage");
const collectedLetters = document.getElementById("collectedLetters");
const finalAnswer = document.getElementById("finalAnswer");
const finalFeedback = document.getElementById("finalFeedback");

let state = loadState();

function defaultState() {
  return { started: false, step: 0, letters: [], cleared: false };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved.step === "number" ? saved : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, element]) => {
    element.hidden = key !== name;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderProgress() {
  progressText.textContent = `祭札 ${state.letters.length} / ${questions.length}`;
  progressDots.replaceChildren();

  questions.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "progress-dot";
    if (index < state.letters.length) dot.classList.add("active");
    progressDots.appendChild(dot);
  });
}

function renderQuestion() {
  if (state.step >= questions.length) {
    renderFinal();
    return;
  }

  const current = questions[state.step];
  stageLabel.textContent = `第${state.step + 1}の記憶`;
  destination.textContent = current.destination;
  stageStory.textContent = current.story;
  questionText.textContent = current.question;
  feedback.textContent = "";
  choices.replaceChildren();

  if (current.image) {
    stageImage.src = current.image;
    stageImage.alt = current.imageAlt;
    photoFrame.hidden = false;
  } else {
    photoFrame.hidden = true;
    stageImage.removeAttribute("src");
  }

  if (current.type === "quiz") {
    current.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = choice;
      button.addEventListener("click", () => checkAnswer(index));
      choices.appendChild(button);
    });
  } else {
    const launch = document.createElement("a");
    launch.className = "primary-button inline-link-button";
    launch.href = current.arPage;
    launch.textContent = current.destination.includes("G館") ? "G館ARを起動する" : "C館ARを起動する";
    launch.target = "_blank";
    launch.rel = "noopener noreferrer";

    const verify = document.createElement("button");
    verify.type = "button";
    verify.className = "secondary-button verify-button";
    verify.textContent = "認識できたらここを押す";
    verify.addEventListener("click", () => verifyArStage(current));

    const help = document.createElement("p");
    help.className = "small-note left-note";
    help.textContent = current.destination.includes("G館")
      ? "コツ：オブジェクトと台座が画面の中央に入るよう、正面からゆっくり近づいてください。"
      : "コツ：看板全体と、まわりのレンガが少し入るようにすると認識しやすいです。";

    choices.appendChild(launch);
    choices.appendChild(verify);
    choices.appendChild(help);
  }

  showScreen("question");
  renderProgress();
}

function verifyArStage(current) {
  if (localStorage.getItem(current.arFlag) !== "true") {
    feedback.textContent = "まだ祭札が見つかっていないようだ。ARページで対象を認識してみよう。";
    return;
  }

  if (!state.letters.includes(current.letter)) state.letters.push(current.letter);
  saveState();
  renderReward(current);
}

function checkAnswer(selectedIndex) {
  const current = questions[state.step];
  const buttons = [...choices.querySelectorAll("button")];

  if (selectedIndex !== current.answerIndex) {
    feedback.textContent = "違うようだ。現地をもう一度、よく確かめてみよう。";
    return;
  }

  buttons.forEach(button => { button.disabled = true; });
  if (!state.letters.includes(current.letter)) state.letters.push(current.letter);
  saveState();
  renderReward(current);
}

function renderReward(question) {
  earnedLetter.textContent = question.letter;
  rewardTitle.textContent = `祭札「${question.letter}」を取り戻した`;
  rewardMessage.textContent = state.step === questions.length - 1
    ? "四枚の祭札がそろった。最後の言葉を完成させよう。"
    : "遠くで祭囃子が聞こえた気がした。次の場所へ向かおう。";
  document.getElementById("nextButton").textContent = state.step === questions.length - 1
    ? "最後の言葉を完成させる"
    : "次の記憶を探す";
  showScreen("reward");
  renderProgress();
}

function goNext() {
  state.step += 1;
  saveState();
  state.step >= questions.length ? renderFinal() : renderQuestion();
}

function renderFinal() {
  collectedLetters.replaceChildren();
  state.letters.forEach(letter => {
    const tile = document.createElement("span");
    tile.textContent = letter;
    collectedLetters.appendChild(tile);
  });
  finalFeedback.textContent = "";
  finalAnswer.value = "";
  showScreen("final");
  renderProgress();
}

function normalizeAnswer(value) {
  return value.normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}

function checkFinal() {
  if (normalizeAnswer(finalAnswer.value) !== "ずいこう") {
    finalFeedback.textContent = "祭札の順番が違うようだ。集めた順に読んでみよう。";
    return;
  }
  state.cleared = true;
  saveState();
  showScreen("clear");
}

function resetGame() {
  if (!window.confirm("進行状況を消して、最初から始めますか？")) return;
  state = defaultState();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("g-object-ar-success");
  localStorage.removeItem("c-center-ar-success");
  renderProgress();
  showScreen("intro");
}

document.getElementById("startButton").addEventListener("click", () => {
  state.started = true;
  saveState();
  renderQuestion();
});
document.getElementById("nextButton").addEventListener("click", goNext);
document.getElementById("finalButton").addEventListener("click", checkFinal);
document.getElementById("resetButton").addEventListener("click", resetGame);
finalAnswer.addEventListener("keydown", event => {
  if (event.key === "Enter") checkFinal();
});

renderProgress();
if (state.cleared) showScreen("clear");
else if (state.started && state.step >= questions.length) renderFinal();
else if (state.started) renderQuestion();
else showScreen("intro");
