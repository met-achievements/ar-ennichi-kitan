const STORAGE_KEY = "arEnnichiKitanProgressV15";

const questions = [
  {
    type: "ar",
    destination: "D館の入口へ向かえ",
    story: "最初の祭札は、D-Centerの前に残された立体の記憶に隠されている。",
    question: "D-Centerをカメラに映し、模型の文字が読める場所まで自分で回り込もう。",
    letter: "ず",
    image: "./assets/images/d-center.jpg",
    imageAlt: "D-Centerの看板",
    arPage: "./d-center-ar.html?v=15",
    arFlag: "d-center-ar-success",
    launchLabel: "D館ARを起動する",
    help: "D-Centerをなるべく画面に残したまま、階段とは反対側へゆっくり回り込んでください。"
  },
  {
    type: "ar",
    destination: "B館の入口へ向かえ",
    story: "二つ目の祭札は、B-Centerの看板に封じられた立体の記憶に隠されている。",
    question: "B-Centerの看板をカメラに映し、現れた模型を指で回して「きおく」の形を完成させよう。",
    letter: "い",
    image: "./assets/images/b-center.jpg",
    imageAlt: "B-Centerの看板",
    arPage: "./b-center-ar.html?v=3",
    arFlag: "b-center-ar-success",
    launchLabel: "B館ARを起動する",
    help: "看板を画面に入れたまま模型を左右に操作し、「きおく」と読める角度を探してください。"
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
    arFlag: "g-object-ar-success",
    launchLabel: "G館ARを起動する",
    help: "オブジェクトと台座が画面の中央に入るよう、正面からゆっくり近づいてください。"
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
    arFlag: "c-center-ar-success",
    launchLabel: "C館ARを起動する",
    help: "看板全体と、まわりのレンガが少し入るようにすると認識しやすいです。"
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

  const launch = document.createElement("a");
  launch.className = "primary-button inline-link-button";
  launch.href = current.arPage;
  launch.textContent = current.launchLabel || "ARを起動する";
  launch.target = "_blank";
  launch.rel = "noopener noreferrer";

  const verify = document.createElement("button");
  verify.type = "button";
  verify.className = "secondary-button verify-button";
  verify.textContent = "祭札を発見したらここを押す";
  verify.addEventListener("click", () => verifyArStage(current));

  const help = document.createElement("p");
  help.className = "small-note left-note";
  help.textContent = current.help || "対象を画面の中央に入れてください。";

  choices.appendChild(launch);
  choices.appendChild(verify);
  choices.appendChild(help);

  showScreen("question");
  renderProgress();
}

function verifyArStage(current) {
  if (localStorage.getItem(current.arFlag) !== "true") {
    feedback.textContent = "まだ祭札が見つかっていないようだ。ARページで謎を解いてみよう。";
    return;
  }

  if (!state.letters.includes(current.letter)) {
    state.letters.push(current.letter);
  }

  saveState();
  renderReward(current);
}

function renderReward(question) {
  earnedLetter.textContent = question.letter;
  rewardTitle.textContent = `祭札「${question.letter}」を取り戻した`;
  rewardMessage.textContent =
    state.step === questions.length - 1
      ? "四枚の祭札がそろった。最後の言葉を完成させよう。"
      : "遠くで祭囃子が聞こえた気がした。次の場所へ向かおう。";

  document.getElementById("nextButton").textContent =
    state.step === questions.length - 1
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
  localStorage.removeItem("d-center-ar-success");
  localStorage.removeItem("b-center-ar-success");
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
