const cardsData = [
  { id: 1, backImg: "./img/card-backside/api-interface-svgrepo-com.svg" },
  { id: 2, backImg: "./img/card-backside/availability-svgrepo-com.svg" },
  { id: 3, backImg: "./img/card-backside/cloud-acceleration-svgrepo-com.svg" },
  { id: 4, backImg: "./img/card-backside/data-analysis-svgrepo-com.svg" },
  { id: 5, backImg: "./img/card-backside/host-record-svgrepo-com.svg" },
  { id: 6, backImg: "./img/card-backside/interface-control-svgrepo-com.svg" },
  { id: 7, backImg: "./img/card-backside/mail-reception-svgrepo-com.svg" },
  { id: 8, id: 8, backImg: "./img/card-backside/mobile-app-svgrepo-com.svg" },
  // Duplicates to create pairs
  { id: 1, backImg: "./img/card-backside/api-interface-svgrepo-com.svg" },
  { id: 2, backImg: "./img/card-backside/availability-svgrepo-com.svg" },
  { id: 3, backImg: "./img/card-backside/cloud-acceleration-svgrepo-com.svg" },
  { id: 4, backImg: "./img/card-backside/data-analysis-svgrepo-com.svg" },
  { id: 5, backImg: "./img/card-backside/host-record-svgrepo-com.svg" },
  { id: 6, backImg: "./img/card-backside/interface-control-svgrepo-com.svg" },
  { id: 7, backImg: "./img/card-backside/mail-reception-svgrepo-com.svg" },
  { id: 8, backImg: "./img/card-backside/mobile-app-svgrepo-com.svg" },
];

// Shuffle the cards
const randomCards = [...cardsData].sort(() => Math.random() - 0.5);

const container = document.getElementById("card-container");

let flippedCards = [];
let lockBoard = false; // Prevents additional flips while checking a match/mismatch
let matchedCards = 0;

function handleCardFlip(cardElement, cardId) {
  if (lockBoard) return;

  //Check if the card is already flipped or is the same card flipped twice
  if (
    cardElement.classList.contains("matched") ||
    flippedCards.includes(cardElement)
  )
    return;

  cardElement.querySelector(".flip-card-inner").classList.add("flip-active");

  // Add the card to the flippedCards array
  flippedCards.push(cardElement);

  //  Check if two cards have been flipped
  if (flippedCards.length === 2) {
    lockBoard = true;

    const [card1, card2] = flippedCards;
    const id1 = parseInt(card1.dataset.cardId);
    const id2 = parseInt(card2.dataset.cardId);

    // Check for a match
    if (id1 === id2) {
      //  MATCH!
      flippedCards.forEach((card) => {
        card.classList.add("matched");
        matchedCards += 1;

        console.log(matchedCards);

        //the machted color change to green
        card.querySelector(".flip-card-back").classList.add("flip-matched");
      });
      // Mark as matched
      resetBoard();
    } else {
      //  MISMATCH!
      setTimeout(() => {
        // Flip the cards back after a delay
        flippedCards.forEach((card) =>
          card.querySelector(".flip-card-inner").classList.remove("flip-active")
        );
        resetBoard();
      }, 1000); // 1 second delay to see the cards
    }
  }
}

function resetBoard() {
  [flippedCards, lockBoard] = [[], false];

  // console.log(`flippedCards : ${flippedCards} `);

  // Optional: Add logic here to check if the game is won
}

randomCards.forEach((card, index) => {
  const cardElement = document.createElement("div");
  cardElement.classList.add("flip-card", "w-full", "h-28");

  cardElement.dataset.cardId = card.id;

  cardElement.innerHTML = `
    <div class="flip-card-inner">
        <div class="flip-card-front">
            <img src="./img/white-question-mark-svgrepo-com.svg" class="w-auto h-16 object-cover" />
        </div>
        <div class="flip-card-back">
            <img src="${card.backImg}" class="w-full h-full object-cover" />
        </div>
    </div>
  `;

  // Pass the element and the card's ID to the new handler function
  cardElement.addEventListener("click", () => {
    handleCardFlip(cardElement, card.id);
  });

  container.appendChild(cardElement);
});
