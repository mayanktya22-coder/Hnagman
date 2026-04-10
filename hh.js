const programming_languages = [
  { word: "python",     hint: "Snake-named, beginner-friendly" },
  { word: "javascript", hint: "Runs in every browser" },
  { word: "mongodb",    hint: "NoSQL document database" },
  { word: "json",       hint: "Lightweight data interchange format" },
  { word: "java",       hint: "Write once, run anywhere" },
  { word: "html",       hint: "Skeleton of the web" },
  { word: "css",        hint: "Styles the web" },
  { word: "golang",     hint: "Made by Google, very fast" },
  { word: "kotlin",     hint: "JVM language, loved by Android devs" },
  { word: "php",        hint: "Powers WordPress" },
  { word: "sql",        hint: "Query relational databases" },
  { word: "ruby",       hint: "Elegant, developer-friendly gem" },
  { word: "rust",       hint: "Memory-safe systems programming" },
  { word: "swift",      hint: "Apple's modern language" },
  { word: "typescript", hint: "JavaScript with types" },
];

let answer     = '';
let hint       = '';
let maxWrong   = 6;
let mistakes   = 0;
let guessed    = [];
let wordStatus = null;
let hintsLeft  = 1;

const $ = id => document.getElementById(id);

function spawnParticles() {
  const container = $('particles');
  const colors = ['#7c6cff', '#ff6b9d', '#00d4aa', '#ffd86e', '#a78bfa'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}vw;
      bottom: -10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 14 + 10}s;
      animation-delay: ${Math.random() * 12}s;
    `;
    container.appendChild(p);
  }
}

function launchConfetti() {
  const colors = ['#7c6cff','#ff6b9d','#00d4aa','#ffd86e','#f472b6','#38bdf8'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.8}s;
      animation-duration: ${Math.random() * 0.8 + 1.2}s;
      transform: rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

function randomWord() {
  const picked = programming_languages[Math.floor(Math.random() * programming_languages.length)];
  answer = picked.word;
  hint   = picked.hint;
}

function generateButtons() {
  const keyboard = $('keyboard');
  keyboard.innerHTML = '';
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
    const btn = document.createElement('button');
    btn.className    = 'key-btn';
    btn.id           = 'key-' + letter;
    btn.textContent  = letter;
    btn.setAttribute('aria-label', `Guess letter ${letter}`);
    btn.onclick      = () => handleGuess(letter);
    keyboard.appendChild(btn);
  });
}

function handleGuess(chosenLetter) {
  if (guessed.includes(chosenLetter)) return;
  guessed.push(chosenLetter);

  const btn = $('key-' + chosenLetter);
  btn.disabled = true;

  if (answer.includes(chosenLetter)) {
    btn.classList.add('correct');
    guessedWord();
    checkIfGameWon();
  } else {
    btn.classList.add('wrong');
    mistakes++;
    updateMistakes();
    updateHangmanPicture();
    flashWrongPanel();
    checkIfGameLost();
  }
}

function guessedWord() {
  const display = $('wordSpotlight');
  display.innerHTML = '';

  wordStatus = answer.split('').map((letter, i) => {
    const isRevealed = guessed.includes(letter);
    const tile = document.createElement('span');
    tile.className = 'letter-tile' + (isRevealed ? ' revealed' : ' blank');
    tile.textContent = isRevealed ? letter.toUpperCase() : '_';
    tile.setAttribute('aria-label', isRevealed ? letter : 'unknown letter');
    tile.style.animationDelay = isRevealed ? `${i * 0.05}s` : '0s';
    display.appendChild(tile);
    return isRevealed ? letter : '_';
  }).join('');
}

function updateMistakes() {
  const livesLeft = maxWrong - mistakes;
  $('livesText').textContent = `${livesLeft} / ${maxWrong}`;

  const pct = (livesLeft / maxWrong) * 100;
  const bar  = $('livesBar');
  bar.style.width = pct + '%';
  if      (pct > 60) bar.style.background = 'linear-gradient(90deg,#ff6b9d,#7c6cff)';
  else if (pct > 30) bar.style.background = 'linear-gradient(90deg,#ffd86e,#ff6b9d)';
  else               bar.style.background = 'linear-gradient(90deg,#ff4d6d,#ff9f43)';

  const hearts = $('heartsRow').querySelectorAll('.heart');
  hearts.forEach((h, i) => {
    if (i === livesLeft && !h.classList.contains('lost')) {
      h.classList.add('pulse');
      setTimeout(() => h.classList.add('lost'), 350);
    }
  });
}

function buildHearts() {
  const row = $('heartsRow');
  row.innerHTML = '';
  for (let i = 0; i < maxWrong; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = '❤️';
    h.id = 'heart-' + i;
    row.appendChild(h);
  }
}

function updateHangmanPicture() {
  const pic = $('hangmanPic');
  pic.src = './images/' + mistakes + '.svg';
  pic.classList.remove('shake');
  void pic.offsetWidth;
  pic.classList.add('shake');
  setTimeout(() => pic.classList.remove('shake'), 500);
}

function flashWrongPanel() {
  const panel = document.querySelector('.word-panel');
  panel.classList.remove('wrong-flash');
  void panel.offsetWidth;
  panel.classList.add('wrong-flash');
  setTimeout(() => panel.classList.remove('wrong-flash'), 600);
}

function checkIfGameWon() {
  if (!wordStatus.includes('_')) {
    setTimeout(() => {
      $('winWord').textContent      = answer.toUpperCase();
      $('statMistakes').textContent = mistakes;
      $('statGuesses').textContent  = guessed.length;
      $('winModal').classList.add('show');
      launchConfetti();
    }, 400);
  }
}

function checkIfGameLost() {
  if (mistakes === maxWrong) {
    setTimeout(() => {
      $('loseWord').textContent = answer.toUpperCase();
      $('loseModal').classList.add('show');
      answer.split('').forEach(l => {
        if (!guessed.includes(l)) guessed.push(l);
      });
      guessedWord();
    }, 500);
  }
}

function useHint() {
  if (hintsLeft <= 0) return;
  hintsLeft--;
  const hintEl = $('categoryHint');
  hintEl.textContent = '💡 ' + hint;
  hintEl.style.animation = 'none';
  void hintEl.offsetWidth;
  hintEl.style.animation = 'hintReveal 0.5s ease both';
  $('hintBtn').disabled = true;
  $('hintBtn').innerHTML = '<span class="btn-icon">💡</span> No more hints';
}

function reset() {
  mistakes   = 0;
  guessed    = [];
  wordStatus = null;
  hintsLeft  = 1;

  $('winModal').classList.remove('show');
  $('loseModal').classList.remove('show');
  $('hangmanPic').src = './images/0.svg';
  $('categoryHint').textContent = '';
  $('hintBtn').disabled = false;
  $('hintBtn').innerHTML = '<span class="btn-icon">💡</span> Hint';
  $('livesBar').style.width = '100%';
  $('livesBar').style.background = 'linear-gradient(90deg,#ff6b9d,#7c6cff)';
  $('livesText').textContent = `${maxWrong} / ${maxWrong}`;

  randomWord();
  buildHearts();
  generateButtons();
  guessedWord();
}

['winModal', 'loseModal'].forEach(id => {
  $(id).addEventListener('click', e => {
    if (e.target === $(id)) $(id).classList.remove('show');
  });
});

async function fetchTime() {
  const el = $('timeDisplay');
  if (!el) return;
  try {
    const res  = await fetch('https://api.api-ninjas.com/v1/worldtime?timezone=UTC', {
      headers: { 'X-Api-Key': '0Ci5j8nunzmQezwK2AsYcdSplE12TJJtx0NniBFh' }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const dt   = new Date(data.datetime.replace(' ', 'T') + 'Z');
    el.textContent = '⏱ ' + dt.toLocaleTimeString('en-US', { timeZone: 'UTC' }) + ' UTC';
  } catch {
    el.textContent = '⏱ -- : -- : -- UTC';
  }
}

spawnParticles();
reset();
fetchTime();
setInterval(fetchTime, 10000);