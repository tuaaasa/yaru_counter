import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const scoreRef = ref(db, 'score');
const historyRef = ref(db, 'history');

let currentScore = { home: 0, guest: 0 };
let historyItems = [];

function formatScore(n) {
  if (n < 0) return `-${String(-n).padStart(2, '0')}`;
  return String(n).padStart(2, '0');
}

// スコアのリアルタイム監視
onValue(scoreRef, (snapshot) => {
  currentScore = snapshot.val() || { home: 0, guest: 0 };
  document.getElementById('op-home-score').textContent = formatScore(currentScore.home);
  document.getElementById('op-guest-score').textContent = formatScore(currentScore.guest);
});

// 履歴のリアルタイム監視
onValue(historyRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    historyItems = Object.entries(data)
      .map(([key, val]) => ({ key, ...val }))
      .sort((a, b) => a.timestamp - b.timestamp);
  } else {
    historyItems = [];
  }
  renderHistory();
});

async function addPoints(team, points) {
  const prevScore = { home: currentScore.home, guest: currentScore.guest };
  const newScore = { ...prevScore, [team]: prevScore[team] + points };
  await set(scoreRef, newScore);
  await push(historyRef, { team, points, prevScore, timestamp: Date.now() });
}

async function undo() {
  if (historyItems.length === 0) return;
  const last = historyItems[historyItems.length - 1];
  await set(scoreRef, last.prevScore);
  await remove(ref(db, `history/${last.key}`));
}

async function resetAll() {
  if (!confirm('スコアをリセットしますか？')) return;
  await set(scoreRef, { home: 0, guest: 0 });
  await set(historyRef, null);
}

function renderHistory() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  [...historyItems].reverse().forEach((item) => {
    const el = document.createElement('div');
    el.className = `history-item ${item.team}`;

    const teamLabel = item.team === 'home' ? 'HOME' : 'GUEST';
    const pointsLabel = item.points > 0 ? `+${item.points}` : String(item.points);
    const scoreAfter = item.prevScore[item.team] + item.points;

    el.innerHTML = `
      <span class="team-label">${teamLabel} <span class="points-label">${pointsLabel}</span></span>
      <span class="score-after">→ ${formatScore(scoreAfter)}</span>
    `;
    list.appendChild(el);
  });
}

// 得点ボタン
document.querySelectorAll('.score-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    addPoints(btn.dataset.team, parseInt(btn.dataset.points));
  });
});

document.getElementById('undo-btn').addEventListener('click', undo);
document.getElementById('reset-btn').addEventListener('click', resetAll);
