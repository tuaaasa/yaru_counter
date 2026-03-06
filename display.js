import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function formatScore(n) {
  if (n < 0) return `-${String(-n).padStart(2, '0')}`;
  return String(n).padStart(2, '0');
}

const homeEl = document.getElementById('home-score');
const guestEl = document.getElementById('guest-score');
const homeNameEl = document.getElementById('home-name');
const guestNameEl = document.getElementById('guest-name');

onValue(ref(db, 'score'), (snapshot) => {
  const data = snapshot.val() || { home: 0, guest: 0 };
  homeEl.textContent = formatScore(data.home);
  guestEl.textContent = formatScore(data.guest);
});

onValue(ref(db, 'teamNames'), (snapshot) => {
  const data = snapshot.val() || {};
  homeNameEl.textContent = data.home || 'HOME';
  guestNameEl.textContent = data.guest || 'GUEST';
});
