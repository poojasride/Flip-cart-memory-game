const cardsData = [
    // ... (Your cardsData array remains the same)
    { id: 1, backImg: "./img/card-backside/api-interface-svgrepo-com.svg" },
    { id: 2, backImg: "./img/card-backside/availability-svgrepo-com.svg" },
    { id: 3, backImg: "./img/card-backside/cloud-acceleration-svgrepo-com.svg" },
    { id: 4, backImg: "./img/card-backside/data-analysis-svgrepo-com.svg" },
    { id: 5, backImg: "./img/card-backside/host-record-svgrepo-com.svg" },
    { id: 6, backImg: "./img/card-backside/interface-control-svgrepo-com.svg" },
    { id: 7, backImg: "./img/card-backside/mail-reception-svgrepo-com.svg" },
    { id: 8, backImg: "./img/card-backside/mobile-app-svgrepo-com.svg" },
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

const container = document.getElementById("card-container");
const modal = document.getElementById("result-modal");
const modalMessage = document.getElementById("modal-message");
const modalTimeScore = document.getElementById("modal-time-score");
const restartButton = document.getElementById("restart-button");

let flippedCards = [];
let lockBoard = false;
let matchedCards = 0;
let timerInterval;
let gameTime = 60; // Total time for the game

// --- Game Logic Functions ---

function displayModal(message, timeRemaining) {
    // Stop the timer
    clearInterval(timerInterval);
    lockBoard = true;

    // Calculate spent time for score display
    const spentSeconds = gameTime - timeRemaining;
    const minutes = Math.floor(spentSeconds / 60);
    const seconds = spentSeconds % 60;
    const timeDisplay = `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

    modalMessage.textContent = message;
    modalTimeScore.innerHTML = `You made **${matchedCards}** matches in **${timeDisplay}**!`;
    
    // Show the modal
    modal.classList.remove("hidden");
}

function handleCardFlip(cardElement, cardId) {
    if (lockBoard) return;

    // Check if the card is already flipped or is the same card flipped twice
    if (
        cardElement.classList.contains("matched") ||
        flippedCards.includes(cardElement)
    )
        return;

    cardElement.querySelector(".flip-card-inner").classList.add("flip-active");

    // Add the card to the flippedCards array
    flippedCards.push(cardElement);

    // Check if two cards have been flipped
    if (flippedCards.length === 2) {
        lockBoard = true;

        const [card1, card2] = flippedCards;
        const id1 = parseInt(card1.dataset.cardId);
        const id2 = parseInt(card2.dataset.cardId);

        // Check for a match
        if (id1 === id2) {
            // MATCH!
            flippedCards.forEach((card) => {
                card.classList.add("matched");
            });

            // For matched card count
            matchedCards += 1;

            document.getElementById(
                "matched-cards"
            ).innerHTML = `Matches: ${matchedCards}/8`;

            resetBoard();
        } else {
            // MISMATCH!
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

    // WIN CONDITION CHECK: If all 8 pairs are matched
    if (matchedCards === 8) {
        // Pass the remaining time to displayModal for correct time calculation
        const remainingTimeText = document.getElementById("timer").textContent.match(/\d+m \d+s/)[0];
        const minutes = parseInt(remainingTimeText.match(/(\d+)m/)[1]);
        const seconds = parseInt(remainingTimeText.match(/(\d+)s/)[1]);
        const remainingTime = minutes * 60 + seconds;
        
        displayModal("🎉 **CONGRATULATIONS! YOU WON!** 🎉", remainingTime);
    }
}

function restartGame() {
    // 1. Reset all variables
    flippedCards = [];
    lockBoard = false;
    matchedCards = 0;
    clearInterval(timerInterval); // Just in case

    // 2. Hide the modal
    modal.classList.add("hidden");

    // 3. Clear and rebuild the card container (for new shuffle)
    container.innerHTML = "";
    
    // 4. Reset displays
    document.getElementById("matched-cards").innerHTML = `Matches: 0/8`;
    
    // 5. Shuffle and draw new cards
    const newRandomCards = [...cardsData].sort(() => Math.random() - 0.5);
    newRandomCards.forEach(createCardElement);

    // 6. Start the countdown again
    countDown();
}

function createCardElement(card) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("flip-card", "w-full", "h-28");
    cardElement.dataset.cardId = card.id;

    cardElement.innerHTML = `
        <div class="flip-card-inner">
            <div class="flip-card-front">
                <img src="./img/card-bg.svg" class="w-auto h-16 object-cover" />
            </div>
            <div class="flip-card-back">
                <img src="${card.backImg}" class="w-full h-full object-cover" />
            </div>
        </div>
    `;

    cardElement.addEventListener("click", () => {
        handleCardFlip(cardElement, card.id);
    });

    container.appendChild(cardElement);
}

function countDown() {
    let timeLeft = gameTime; // Use the gameTime variable

    timerInterval = setInterval(() => {
        // Prevent time from running down if the game is won/lost and modal is up
        if (lockBoard) { 
            clearInterval(timerInterval); 
            return;
        }

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        const displaySeconds = seconds.toString().padStart(2, '0');
        const displayMinutes = minutes.toString().padStart(2, '0');

        document.getElementById("timer").innerHTML = `Time : ${displayMinutes}m ${displaySeconds}s`;

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            // Time Out - LOSS Condition
            document.getElementById("timer").innerHTML = "⏱️ **TIME UP!**";
            displayModal("😢 **TIME UP! GAME OVER!** 😢", 0); 
        }
    }, 1000);
}

// --- Initialization ---

// 1. Initial card creation
randomCards.forEach(createCardElement);

// 2. Attach restart listener to the button in the modal
restartButton.addEventListener("click", restartGame);

// 3. Start the timer
countDown();