const cardList = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb', 'fa-cube', 'fa-cube'];
var openList = [];
var moveCounter = 0;
var matched = [];
var time = 0;
var hasStarted = false;

var starCount = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function displayCards(cardList) {
    shuffle(cardList);
    for (const card in cardList) {
        $('.deck').append('<li class="card"><i class="fa ' + cardList[card] + '"></i></li>');
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//clear deck
function clearDeck() {
    $('.deck').empty();
    displayCards(cardList);
    resetCounter();
    openList = [];
}

//Display individual card
function showCard(e) {
    $(e.target).addClass('open show');
}

//add open card to list

function addToOpen(card) {
    openList.push(card);
}

function checkMatch(card1, card2) {
    return card1.className === card2.className;
}

function matchedCards(card1, card2, matchedList) {
    matchedList.push(card1);
    matchedList.push(card2);
    openList.length = 0;
}

function noMatch(opencards) {
    opencards.forEach(function (card) {
        $(card.parentElement).removeClass('open show');
    });
    openList.length = 0;
}

function incrementMove() {
    var moves;
    moveCounter++;
    moves = document.querySelector('.moves');
    console.log(moves);
    moves.innerHTML = moveCounter;
}

function resetCounter() {
    var moves;
    moveCounter = 0;
    moves = document.querySelector('.moves');
    moves.innerHTML = moveCounter;
}

function changeStars() {
    var stars = $('.stars');
    if (moveCounter > 7) {
        stars.children().first().hide();
        starCount = 2;
    }
    if (moveCounter > 12) {
        stars.children().eq(1).hide();
        starCount = 1;
    }
}

function isGameOver() {
    if(matched.length > 15) {
        toggleModal();
        modalContent.innerHTML = 'Congrats you took' + time + 'seconds ' + moveCounter + ' moves later and' + starCount + ' stars! Close this box to restart';
        clearInterval(timeCheck);
        return true;
    }
    return false;
};

function openLogic() {
    if (openList.length > 1) {
        const result = checkMatch(openList[1], openList[0]);
        console.log(result);
        if (result) {
            matchedCards(openList[0], openList[1], matched);
        } else {
            // doesn't seem to have a timeout
            setTimeout(noMatch(openList), 30000);
        }
        incrementMove();
    }
    changeStars();
}


function changeTime() {
    let timer = document.getElementById('timer');
    timer.innerHTML = time;
    time++;
}

function restartGame() {
    let timer = document.getElementById('timer');
    timer.innerHTML = 0;
    time = 0;
    hasStarted = false;
    var stars = $('.stars');
    matched = [];
    clearDeck();
    stars.children().eq(1).show();
    stars.children().first().show();
}


//Clear deck at beginning of match
clearDeck();
var timeCheck = setInterval(function(){
    if(isGameOver){
        isGameOver();
    }
    changeTime();
},1000);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

$('.deck').click('.card', function (event) {
    const clickedCard = event.target.childNodes[0];
    showCard(event);
    setTimeout(function () {
        addToOpen(clickedCard);
        openLogic();
    }, 500);
});


//restart the match
$('.restart').click(function () {
    restartGame();
});

//modal
var modal = document.querySelector(".modal");
var closeButton = document.querySelector(".close-button");
var modalContent = document.querySelector(".modal-content h1");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

closeButton.addEventListener("click", function () {
    toggleModal();
    restartGame();
});
window.addEventListener("click", windowOnClick);
