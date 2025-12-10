const cardsData = [
  { id: 1, backImg: "./img/card-backside/api-interface-svgrepo-com.svg" },
  { id: 2, backImg: "./img/card-backside/availability-svgrepo-com.svg" },
  { id: 3, backImg: "./img/card-backside/cloud-acceleration-svgrepo-com.svg" },
  { id: 4, backImg: "./img/card-backside/data-analysis-svgrepo-com.svg" },
  { id: 5, backImg: "./img/card-backside/host-record-svgrepo-com.svg" },
  { id: 6, backImg: "./img/card-backside/interface-control-svgrepo-com.svg" },
  { id: 7, backImg: "./img/card-backside/mail-reception-svgrepo-com.svg" },
  { id: 8, backImg: "./img/card-backside/mobile-app-svgrepo-com.svg" },

  // duplicates
  { id: 1, backImg: "./img/card-backside/api-interface-svgrepo-com.svg" },
  { id: 2, backImg: "./img/card-backside/availability-svgrepo-com.svg" },
  { id: 3, backImg: "./img/card-backside/cloud-acceleration-svgrepo-com.svg" },
  { id: 4, backImg: "./img/card-backside/data-analysis-svgrepo-com.svg" },
  { id: 5, backImg: "./img/card-backside/host-record-svgrepo-com.svg" },
  { id: 6, backImg: "./img/card-backside/interface-control-svgrepo-com.svg" },
  { id: 7, backImg: "./img/card-backside/mail-reception-svgrepo-com.svg" },
  { id: 8, backImg: "./img/card-backside/mobile-app-svgrepo-com.svg" },
];

const container = document.getElementById("card-container");
const modal = document.getElementById("result-modal");
const modalMessage = document.getElementById("modal-message");
const modalTimeScore = document.getElementById("modal-time-score");
const restartButton = document.getElementById("restart-button");
const resetGame = document.getElementById("restart-game");

let flippedCards = [];
let lockBoard = false;
let matchedCards = 0;
let movedCards = 0;
let timerInterval;
let gameTime = 120;

function displayModal(message, timeRemaining) {
  clearInterval(timerInterval);
  lockBoard = true;

  const elapsed = gameTime - timeRemaining;
  const m = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0");
  const s = (elapsed % 60).toString().padStart(2, "0");

  modalMessage.innerHTML = message;
  modalTimeScore.innerHTML = `You made <strong>${matchedCards}</strong> matches in <strong>${m}m ${s}s</strong>!`;
  modal.classList.remove("hidden");
}

function handleCardFlip(cardElement, cardId) {
  if (lockBoard) return;
  if (
    cardElement.classList.contains("matched") ||
    flippedCards.includes(cardElement)
  )
    return;

  cardElement.querySelector(".flip-card-inner").classList.add("flip-active");
  flippedCards.push(cardElement);

  // Moved card counts
  movedCards++;
  document.getElementById("moved-cards").innerHTML = `Moves : ${movedCards}`;

  if (flippedCards.length === 2) {
    lockBoard = true;
    const [card1, card2] = flippedCards;
    const id1 = +card1.dataset.cardId;
    const id2 = +card2.dataset.cardId;

    if (id1 === id2) {
      matchedCards++;
      document.getElementById(
        "matched-cards"
      ).innerHTML = `Matches: ${matchedCards}/8`;
      flippedCards.forEach((c) => c.classList.add("matched"));
      resetBoard();
    } else {
      setTimeout(() => {
        flippedCards.forEach((c) =>
          c.querySelector(".flip-card-inner").classList.remove("flip-active")
        );
        resetBoard();
      }, 800);
    }
  }
}

function resetBoard() {
  flippedCards = [];
  lockBoard = false;

  if (matchedCards === 8) {
    const timerText = document
      .getElementById("timer")
      .textContent.match(/\d+m \d+s/)[0];
    const [min, sec] = timerText.match(/\d+/g).map(Number);
    displayModal("🏅CONGRATS! YOUR WIN THE GAME! 🎉", min * 60 + sec);
  }
}

function restartGame() {
  matchedCards = 0;
  movedCards = 0;
  flippedCards = [];
  lockBoard = false;
  clearInterval(timerInterval);

  modal.classList.add("hidden");
  container.innerHTML = "";
  document.getElementById("matched-cards").innerHTML = `Matches: 0/8`;
  document.getElementById("moved-cards").innerHTML = `Moves : 0`;

  startGame();
}

function createCardElement(card) {
  const cardEl = document.createElement("div");
  // class filp-card
  cardEl.classList.add("flip-card", "w-full", "h-25");
  cardEl.dataset.cardId = card.id;

  cardEl.innerHTML = `
        <div class="flip-card-inner cursor-pointer">
            <div class="flip-card-front"><img src="./img/card-bg.svg" class="h-16"></div>
            <div class="flip-card-back"><img src="${card.backImg}" class="h-full"></div>
        </div>
    `;

  cardEl.addEventListener("click", () => handleCardFlip(cardEl, card.id));
  container.appendChild(cardEl);
}

function countDown() {
  let timeLeft = gameTime;

  timerInterval = setInterval(() => {
    if (lockBoard) return;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById("timer").innerHTML = `Time : ${m}m ${s
      .toString()
      .padStart(2, "0")}s`;

    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timerInterval);
      displayModal("⏰ TIME’S UP! YOU’LL ROCK IT NEXT TIME! 🌟", 0);
    }
  }, 1000);
}

function startGame() {
  // [] shallow copy for original arr

  // 0.5 gives postive and negative value
  const randomCards = [...cardsData].sort(() => Math.random() - 0.5);
  randomCards.forEach(createCardElement);
  countDown();
}


startGame();

// This for Playagain section
restartButton.addEventListener("click", restartGame);

// This for Reset game section
resetGame.addEventListener("click", restartGame);
