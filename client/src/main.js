let canvasWidth = 800;
const canvasHeight = 600;

let cardW = 76;
let cardH = cardW * 2
const cardDefaultX = Math.floor(canvasWidth * 0.025);
const cardDefaultY = canvasHeight - cardH;

const suits = ['spada', 'kupa', 'dinar', 'baston'];
var gamePhase = 'start';
var deck = [];
var shuffled;

var humanPlayer;
var queue = [];

var team1;
var team2;

var startTime = -1
var winingCard = {};

var firstPlayer;
var lockPlayer = false;

//1 = humanPlayer, 2 = enemy1 ...
var current = 1;
var board = [];
var images = [];
let bg;
let waitTime = 500;
let showTime = 800;



function preload() {
    for (var i = 0; i <= 3; i++) {
        for (var j = 2; j <= 11; j++) {
            var img = loadImage(`./assets/img/karte/Karte-briskola [www.imagesplitter.net]-${i}-${j}.png`);
            images.push(img);
        }
    }
    // bg = loadImage('./assets/img/background.png');
    // bg = loadImage('./assets/img/background2.jpg');
    bg = loadImage('./assets/img/background3.jpg');
}

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent("sketch")

    //generate deck
    for (var j in suits) {
        for (var i = 13; i > 0; i--) {
            if (i == 8 || i == 9 || i == 10) {
                continue;
            }
            deck.push(new Card(i, suits[j], images.shift()));
        }
    }

    winingCard.card = new Card(0, 'none');

    initialize()

    print("\nTurn no: " + (turnCounter + 1) + "\n");
}

//animation flags
let animationInProgress = false;
let coordinatesAdjusted = false;

function draw() {
    background(bg);

    var tempCard;
    for (var card of humanPlayer.hand) {
        if (!lockPlayer) {
            card.hover();
        }
        if (card.drawLast) {
            tempCard = card;
            continue;
        }
        card.show();
    }

    if (tempCard) {
        tempCard.show();
        cursor(HAND);
    } else {
        cursor(ARROW);
    }

    if (coordinatesAdjusted) {
        for (let card of humanPlayer.hand) {
            transitionAnimation(card, destinationCards[humanPlayer.hand.indexOf(card)]);
        }
    }

    if (animationInProgress) {
        animateCardsLeaving(winingCard.player.direction);
        showLeaving();
    } else {
        mainLogic();
        showBoard();
    }
}

function showBoard() {
    let i = 0;
    for (var card of board) {
        card.x = 228 + (cardW + 10) * i++;
        card.y = canvasHeight/2 - cardH;
        card.show();
    }
}

function showLeaving() {
    let i = 0;
    for (var card of board) {
        card.show();
    }
}

//array of integers
let destinationCards = [];
function mousePressed() {
    while (lockPlayer) { return; }

    for (var card of humanPlayer.hand) {
        if (card.mouseInCard() && humanPlayer.isLegit(card)) {
            board.push(card);
            humanPlayer.removeCard(card);
            setWiningCard(card, humanPlayer);

            //adjust coordinates of cards in hand to enable transiton animation
            //--------------------------------------
            //fill destinationCards with current x coordinates
            for (let card of humanPlayer.hand) {
                destinationCards.push(card.x);
            }

            adjustCoordinates(destinationCards);
            //--------------------------------------

            lockPlayer = true;

            //cancel hover effect on card
            card.width = cardW;
            card.height = cardH;

            startTime = millis()

            let temp = queue.shift();
            queue.push(temp);

        }
    }
}

let turnCounter = 0;
let animationDone = false;
function mainLogic() {
    if (turnCounter < 10) {
        if (board.length < 4) {
            if (queue[0].id == 1) {
                lockPlayer = false;

                //show text to the player
                showText("Your Turn!", 'lower');

                return;
            } else if (millis() - startTime >= waitTime) {
                let currentPlayer = queue.shift();
                current = currentPlayer.id;
                queue.push(currentPlayer);

                aiTurn(currentPlayer);

                startTime = millis()
            }
            else {
                return;
            }
        } else {
            if (millis() - startTime >= showTime) {
                if (animationDone) {
                    process();
                    turnCounter++;
                    startTime = millis()
                    animationDone = false;
                    animationInProgress = false;
                } else {
                    animationInProgress = true;
                    return;
                }

                if (turnCounter < 10) {
                    transp = 255;   //reset transparency 
                    print("\nTurn no: " + (turnCounter + 1) + "\n");
                }
            }
        }

    } else {
        //turnCounter = 0;
        print("\nGame over!!!\n");
        endGame();
        noLoop()
    }
}

//handles AI's turn
function aiTurn(currentPlayer) {
    var playedCard = currentPlayer.playCard();
    board.push(playedCard);
    print("Player " + currentPlayer.id + " played card: " + playedCard.getCardName());
    setWiningCard(playedCard, currentPlayer);
}

function initialize() {
    shuffled = shuffle(deck);
    gamePhase = 'middle';

    //generate players
    humanPlayer = new Player(shuffled.splice(0, 10), 1, [0, 1]);
    humanPlayer.sortHand();

    //add players to queue
    queue.push(humanPlayer);

    for (let i = 0; i < 3; i++) {
        queue.push(new Player(shuffled.splice(0, 10), i + 2))
    }
    queue[1].direction = [1, 0];
    queue[2].direction = [0, -1];
    queue[3].direction = [-1, 0];

    //make teams
    team1 = new Team(queue[0], queue[2]);
    team2 = new Team(queue[1], queue[3]);

    //set x coordinate of cards in players hand
    dx = cardW;
    var i = 0;
    for (var card of humanPlayer.hand) {
        card.x = cardDefaultX + cardW * i;
        card.y = cardDefaultY;

        card.originalX = card.x;
        card.originalY = card.y;
        i++;
    }

    firstPlayer = true;
}

let transp = 255;
/**
 * Show text on canvas
 * @param {string} str String to write
 * @param {string} position Position to write: lower, center
 */
function showText(str, position) {
    fill(0, 0, 0, transp -= 2);
    textSize(40);
    if(position  == 'lower'){
        text(str, canvasWidth / 2 - textWidth(str) / 2, canvasHeight * 3 / 4 - 50);
    } else if(position == 'center'){
        text(str, canvasWidth / 2 - textWidth(str) / 2, canvasHeight/2);
    }
}

function changeSpeed(string) {
    switch (string) {
        case "slower":
            if (waitTime <= 3750) {
                waitTime += 250
            }
            break;
        case "faster":
            if (waitTime >= 500) {
                waitTime -= 250;
            }
            break;
        case "skip":
            showTime = 0; waitTime = 0;
            increment = -1;
            break;
        default:
            waitTime = 500;
    }
    print("waiting time [ms]: " + waitTime);
}

function setWiningCard(playedCard, currentPlayer) {
    if (firstPlayer) {
        winingCard.card = playedCard;
        winingCard.player = currentPlayer;
        firstPlayer = false;
    }

    if ((playedCard.calculateStrength() > winingCard.card.calculateStrength()) && playedCard.suit == winingCard.card.suit) {
        winingCard.card = playedCard;
        winingCard.player = currentPlayer;
    }
}

//process single round
function process() {
    var score = 0;
    for (var card of board) {
        score += card.getCardPoints();
    }
    generateQueue(winingCard.player);

    winingCard.player.score += score;

    //reset everything
    winingCard.card.suit = 'none';
    winingCard.card.value = 0;
    winingCard.player = null;
    board = [];
}

function animateCardsLeaving(direction) {
    animationInProgress = true;
    for (var card of board) {
        card.x += direction[0] * 30;
        card.y += direction[1] * 30;
    }
    if (board[0].x > canvasWidth || board[0].y + cardH > canvasHeight*3/4
        || board[1].x < 0 || board[1].y < 0) {
        animationInProgress = false;
        animationDone = true;
    }
}

function adjustCoordinates(destinationCards) {
    let indexOfMiddleCard;
    let middleX;

    //case 2n, before removal length was 2n + 1; adjust card's (at index) origin to center
    if (humanPlayer.hand.length % 2 == 0) {
        middleX = canvasWidth / 2;
        indexOfMiddleCard = humanPlayer.hand.length / 2;
    } else {
        //case 2n + 1, adjust middle of the card (at index) to the center
        middleX = canvasWidth / 2 - (cardW / 2);
        indexOfMiddleCard = (humanPlayer.hand.length - 1) / 2;
    }

    //adjust middle card
    destinationCards[indexOfMiddleCard] = middleX;

    let widthFactor = 1;
    //i adjusts cards to the left of the middle card, j adjust ones to the right
    for (let i = indexOfMiddleCard - 1, j = indexOfMiddleCard + 1; i >= 0; i--) {
        if (j < humanPlayer.hand.length) {
            //do j related stuff
            destinationCards[j++] = middleX + cardW * widthFactor;
        }
        destinationCards[i] = middleX - cardW * widthFactor;
        widthFactor++;
    }
    coordinatesAdjusted = true;
}
/**
 * Simulates one step in transition animation, moving object from start position to destination
 * Increases start.x coordinate by increment
 * Increment = -1 signals to skip animations
 * @param {number} start 
 * @param {number} dest 
 */
let increment = 2;
function transitionAnimation(start, dest) {
    let reminder = dest % increment;

    if(increment == -1) {
        start.x = dest;
    }

    if (start.x == dest) {
        coordinatesAdjusted = false;
        return;
    }
    
    // adjusts increment; todo: make it possible to increase speed
    if (dest - start.x == reminder) {
        increment = reminder;
    }

    if (start.x < dest) {
        start.x += increment;
    } else if (start.x > dest) {
        start.x -= increment;
    }
}

//puts player to play first on begining of queue
function generateQueue(player) {
    if (player.hand.length > 0) {
        var index = queue.findIndex(a => a.id == player.id);
        for (var i = 0; i < index; i++) {
            var temp = queue.shift();
            queue.push(temp);
        }
        current = player.id;
        firstPlayer = true;

    } else if (player.hand.length == 0) {
        player.score += 3;
        //endGame();
    }
}

//shuffle function, return new array
function shuffle(originalArray) {
    var array = originalArray.slice(0);
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function endGame() {
    gamePhase = 'end';

    var winner = (team1.getTeamScore() > team2.getTeamScore() ? team1 : team2);
    if(winner.player1 == humanPlayer || winner.player2 == humanPlayer){
        showText("You won!", 'center');
        showText("Team score: " + winner.getFormatedScore(), 'lower');
    } else {
        showText("You Lost!", 'center');
        showText("Team score: " + team1.getFormatedScore(), 'lower');
    }
    print("Pobijedili su: " + winner.getTeamName());
    print("Imali su " + winner.getFormatedScore());

    //testing
    print("\n")
    print("Team1: " + team1.getTeamName() + " " + team1.getFormatedScore());
    print("Team2: " + team2.getTeamName() + " " + team2.getFormatedScore());

    // for (var player of queue) {
    //     player.resetScore();
    // }

    // queue = [];
    // board = [];
    // current = 1;
    // lockPlayer = false;
    // gamePhase = 'start';
}