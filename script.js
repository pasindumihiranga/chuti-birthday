/* ============================================
   CONTENT — edit the text here if you ever need to
   ============================================ */
const ANSWER_1 = "chuti";
const ANSWER_2 = "sudu mnika";

const WISH_TEXT = "Happy birthday my world, Chuti! ❤️😘 Every moment with you feels like magic, and I feel incredibly blessed to have you in my life. ✨";

const MESSAGE_TEXT = "Happy birthday to the woman who holds my heart. ❤️ You are the my best part of every single day. Thank you for filling my life with so much light and laughter. 😘😉 Today is all about celebrating you, and I promise to spend the rest of the year making sure you feel just as loved, cherished, and adored as you do right now. Happy birthday, my beautiful girl, Chuti Mnika. ✨❤️ Ithin chuti mnika matath hithuna podi mathaka hitina gift ekk denn mathaka hitid nn danne na ithin 🤭 mn ehema kiuve mn innakn meka vada karnva ona velavka ekai 😉 Kohoma hari uda kiyla thiyenva vage oya thama dan mage mulu lokema vela thiyenne 😘 Onn inna ada oyge daws Happy birthday mge kaha made 🌝😘 adlei godaaariyk ❤️";

/* ============================================
   FALLING HEARTS BACKGROUND
   ============================================ */
function spawnHearts() {
  const container = document.getElementById("heartsBg");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const symbols = ["❤", "💗", "💕", "💖"];
  const heartCount = window.innerWidth < 480 ? 22 : 34;

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("span");
    heart.className = "falling-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const size = 12 + Math.random() * 18;
    const left = Math.random() * 100;
    const duration = 7 + Math.random() * 8;
    const delay = Math.random() * 10;

    heart.style.left = left + "vw";
    heart.style.fontSize = size + "px";
    heart.style.animationDuration = duration + "s";
    heart.style.animationDelay = "-" + delay + "s";

    container.appendChild(heart);
  }
}

/* ============================================
   STEP NAVIGATION
   ============================================ */
const steps = {
  1: document.getElementById("step1"),
  2: document.getElementById("step2"),
  audio: document.getElementById("stepAudio"),
  3: document.getElementById("step3"),
  4: document.getElementById("step4"),
};

const progressHearts = document.querySelectorAll(".progress-heart");

function goToStep(key, progressNumber) {
  Object.values(steps).forEach((el) => el.classList.remove("active"));
  steps[key].classList.add("active");

  if (progressNumber) {
    progressHearts.forEach((dot) => {
      const dotStep = parseInt(dot.dataset.step, 10);
      dot.classList.toggle("filled", dotStep <= progressNumber);
    });
  }
}

/* ============================================
   ANSWER VALIDATION HELPERS
   ============================================ */
function normalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

function showHint(hintEl, inputEl) {
  hintEl.classList.add("show");
  inputEl.classList.remove("shake");
  void inputEl.offsetWidth; // restart animation
  inputEl.classList.add("shake");
}

/* ============================================
   STEP 1
   ============================================ */
const input1 = document.getElementById("input1");
const hint1 = document.getElementById("hint1");

document.getElementById("next1").addEventListener("click", () => {
  if (normalize(input1.value) === normalize(ANSWER_1)) {
    goToStep(2, 2);
    setTimeout(() => document.getElementById("input2").focus(), 300);
  } else {
    showHint(hint1, input1);
  }
});

input1.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("next1").click();
});

/* ============================================
   STEP 2 -> AUDIO -> STEP 3
   ============================================ */
const input2 = document.getElementById("input2");
const hint2 = document.getElementById("hint2");
const audioEl = document.getElementById("loveAudio");
const skipBtn = document.getElementById("skipAudio");
let advanced = false;

function goToStep3() {
  if (advanced) return;
  advanced = true;
  goToStep(3, 3);
}

document.getElementById("next2").addEventListener("click", () => {
  if (normalize(input2.value) === normalize(ANSWER_2)) {
    advanced = false;
    goToStep("audio", 3);

    // Try to play the audio clip (this is allowed because it's triggered by a tap)
    audioEl.currentTime = 0;
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked or file missing — move on after a short pause
        setTimeout(goToStep3, 1200);
      });
    }

    // Show a "skip" link in case the clip is long or doesn't fire the ended event
    setTimeout(() => skipBtn.classList.add("show"), 4000);
  } else {
    showHint(hint2, input2);
  }
});

input2.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("next2").click();
});

audioEl.addEventListener("ended", goToStep3);
audioEl.addEventListener("error", () => setTimeout(goToStep3, 800));
skipBtn.addEventListener("click", () => {
  audioEl.pause();
  goToStep3();
});

/* ============================================
   STEP 3 -> STEP 4
   ============================================ */
document.getElementById("wishText").innerHTML = "<strong>" + WISH_TEXT + "</strong>";
document.getElementById("messageText").textContent = MESSAGE_TEXT;

document.getElementById("next3").addEventListener("click", () => {
  goToStep(4, 4);
});

/* ============================================
   INIT
   ============================================ */
spawnHearts();
goToStep(1, 1);
