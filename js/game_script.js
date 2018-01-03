var CONSTANTS = Object.freeze({
    PATH: 'images/cards/',
    PATH_END:'.jpg', //path to img files
    PREFIX: ['p','k','c','t'], //prefix for cards
    LIMIT: 21, 
    DEALER_LIMIT: 16, //below this value dealer must hit
    MONEY: 100, //starts money
    INFO_BJ: 'Blackjack! You won!',
    INFO_WIN: 'You won!',
    INFO_LOSE: 'You lost',
    INFO_TIE: 'Push', //infos
    BET_1: 1,
    BET_2: 5,
    BET_3: 10,
    BET_4: 20 //BET_1 : BET_4 - values for coins
})

/*CARD CREATOR*/
function Card(color, simbol, power, imagePath) {
    this.color = color;
    this.simbol = simbol;
    this.power = power;
    this.imagePath = imagePath;
}
var package = [['a',11], ['k',10],['q',10],['j',10]];
for (var i = 10; i>=2; i--) {
    var tabNumbers =[i,i];
    package.push(tabNumbers);
} //2-10 add to package
var colorsSimbols = ['&spades;','&hearts;','&diams;', '&clubs;']; //html entities for cards symbols, can be useful in the future
var prefix = CONSTANTS.PREFIX; //prefix for images
function createCards(color,prefix, simbols) {
    for (var i =0, size = simbols.length; i<size; i++){
        cardsStack.push(new Card(color, simbols[i][0],simbols[i][1],CONSTANTS.PATH+prefix+simbols[i][0]+CONSTANTS.PATH_END));
    }
}
var cardsStack = []; //tablica kart
createCards(colorsSimbols[0], CONSTANTS.PREFIX[0],package); //spades cards
createCards(colorsSimbols[1], CONSTANTS.PREFIX[1],package); //heart cards
createCards(colorsSimbols[2], CONSTANTS.PREFIX[2],package); //diamond cards
createCards(colorsSimbols[3], CONSTANTS.PREFIX[3],package); //club cards
/*card ready*/

//main
var cardsMix = [];
shuffling(cardsStack);
var player = {
    cards: [],
    score: 0,
    money: CONSTANTS.MONEY,
    loc: document.getElementById('js-playerCards'), //place for cards
    scoreArea: document.getElementById('js-actualPlayerStatus') //actual points
}
var computer = {
    cards: [],
    score: 0,
    loc: document.getElementById('js-compCards'),
    scoreArea: document.getElementById('js-actualComputerStatus')
}

var inBet = 0; 
var infoInBet = document.getElementById('js-bet');
var resultInfo = document.getElementById('js-info');
var money = document.getElementById('js-money');
var betBtnsGroup = document.getElementById('js-betButtons');
money.innerHTML = player.money+'$'; //initial player money
//buttons
var btnHit = document.getElementById('hit');
var btnStand = document.getElementById('stand');
var btnB1 = document.getElementById('bb1');
var btnB2 = document.getElementById('bb2');
var btnB3 = document.getElementById('bb3');
var btnB4 = document.getElementById('bb4');
var btnClear = document.getElementById('bclear');
var btnDeal = document.getElementById('js-deal');
var btnPlayAgain = document.getElementById('js-againPlay');
var btnsToCheck = document.querySelectorAll('.chip');
var btnsBetListValue = [CONSTANTS.BET_1, CONSTANTS.BET_2, CONSTANTS.BET_3, CONSTANTS.BET_4];
//button action
btnB1.addEventListener('click', function(){
    btnsBetAction(CONSTANTS.BET_1, this);
});
btnB2.addEventListener('click', function(){
    btnsBetAction(CONSTANTS.BET_2, this);
});
btnB3.addEventListener('click', function(){
    btnsBetAction(CONSTANTS.BET_3, this);
});
btnB4.addEventListener('click', function(){
    btnsBetAction(CONSTANTS.BET_4, this);
});
btnClear.addEventListener('click', function(){
    inBet = 0;
    infoInBet.innerHTML = inBet + '$';
    money.innerHTML = player.money + '$';
    btnDeal.style.setProperty('visibility', 'hidden');
    hideOptionsBtns();
    checkCoinBtns();
});
btnDeal.addEventListener('click', function(){
    var btnVisibilty = document.querySelector('.options');
    btnVisibilty.style.setProperty('visibility','visible');
    startGetCard();
    hideDealBtn();
    hideBetButtons();
});
/*
btnB1.addEventListener('click', function(){
   inBet+=1;
    infoInBet.innerHTML = inBet+'$';
    money.innerHTML = player.money - inBet;
});
*/
btnStand.addEventListener('click',function(){
    computerPlay(); 
    hideOptionsBtns();
});
btnHit.addEventListener('click', function(){
    hit(player);
});
btnPlayAgain.addEventListener('click', function(){
    btnPlayAgain.style.setProperty('visibility', 'hidden');
    startAgain();
});

checkCoinBtns();

//function
function btnsBetAction(value, button) { //for coins buttons
    inBet += value;
    infoInBet.innerHTML = inBet+'$';
    money.innerHTML = (player.money - inBet)+'$';
    showDealButton();
    checkCoinBtns();
}
function shuffling(arrayToShuffle) { 
    cardsMix = [];
    var toUse = arrayToShuffle.slice(); //to copy value
    while(toUse.length>0) {
        var draw = Math.floor(Math.random()*toUse.length);
        cardsMix.push(toUse[draw]);
        toUse.splice(draw, 1);
    }
}
function showCard(location,cardPath) { //show card on table
    var newCard = document.createElement('div');
    newCard.classList.add('card');
    location.appendChild(newCard);
    var newImage = document.createElement('img');
    newImage.setAttribute('src',cardPath);
    newImage.setAttribute('alt','card')
    newCard.appendChild(newImage);
}
function hit(who) {
    var drawCard = cardsMix.pop();
    who.cards.push(drawCard);
    who.score += drawCard.power;
    showCard(who.loc, drawCard.imagePath);
    refreshActualScore(who);
    //console.log(checkBust(who));
    if (checkBust(who) && who === player) {
        bustPlayer();
        if(!lostMoney()) {
            showPlayAgain();
        }
    }   
}
function bustPlayer() {
    hideOptionsBtns();
    resultInfo.innerHTML = 'You bust';
    player.money -= inBet;
    money.innerHTML = player.money + '$';
    infoInBet.innerHTML = '0$'; 
}
function startGetCard() { //start after click 'deal' btn
    hit(player);
    hit(computer);
    hit(player);
    checkBlackJack();
}
function refreshActualScore(who) {
    who.scoreArea.innerHTML = who.score;
}

function checkBlackJack() {
    if (player.score==CONSTANTS.LIMIT) {
        resultInfo.innerHTML = 'Blackjack! You won';
        hideOptionsBtns();
        blackJack();
    }
    return false;
}
function blackJack() {
    player.money += Math.floor(inBet*1.5); //to avoid float
    money.innerHTML = player.money;
    infoInBet.innerHTML = 0 + '$';
    inBet = 0;
    showPlayAgain();
}
function computerPlay() {
    while (computer.score<=CONSTANTS.DEALER_LIMIT) { //checking if the delaer musts to play
        hit(computer);
    }
    if (checkBust(computer)){
        resultInfo.innerHTML = CONSTANTS.INFO_WIN+' dealer busted';
        player.money += inBet;
        money.innerHTML = player.money + '$';
        infoInBet.innerHTML = '0$';
        showPlayAgain();
    } else {
        resultCheck();
    }
}
function resultCheck() {
    if (player.score == computer.score){
        resultInfo.innerHTML = CONSTANTS.INFO_TIE;
        inBet = 0;
        money.innerHTML = player.money + '$';
        infoInBet.innerHTML = '0$';
        showPlayAgain();
    } else if (player.score < computer.score) {
        resultInfo.innerHTML = CONSTANTS.INFO_LOSE;
        player.money -= inBet;
        infoInBet.innerHTML = 0 + '$';
        inBet = 0;
        if(!lostMoney()) {
            showPlayAgain();
        }
    } else {
        resultInfo.innerHTML = CONSTANTS.INFO_WIN;
        player.money += inBet;
        money.innerHTML = player.money + '$';
        infoInBet.innerHTML = 0 + '$';
        inBet = 0;
        showPlayAgain();
    }
}
function checkBust(who) {
    if (who.score > CONSTANTS.LIMIT) {
        return true;
    } else {
        return false;
    }
}
function lostMoney() { //end of game :(
    if (player.money===0){
        resultInfo.innerHTML = "You lost all your money. Game over";
        return true;
    } else {
        return false;
    }
}
function startAgain() {
    clearCards(computer);
    clearCards(player);
    showBetButtons();
    inBet = 0;
    shuffling(cardsStack);
    checkCoinBtns();
}
function clearCards(who) { //clear table
    while (who.loc.firstChild) {
        who.loc.removeChild(who.loc.firstChild);
    }
    who.scoreArea.innerText = 0;
    who.score = 0;
}
//hide or show functions
function checkCoinBtns() { //check which coin btns should be active
    var toCheck = player.money - inBet;
    for (var i = 0; i<btnsBetListValue.length; i++) {
        if (toCheck<btnsBetListValue[i]) {
            btnsToCheck[i].disabled = true;
        } else {
            btnsToCheck[i].disabled = false;
        }
    }
}
function showDealButton() {
    btnDeal.style.setProperty('visibility','visible');
}
function hideOptionsBtns() {
    var btnVisibilty = document.querySelector('.options');
    btnVisibilty.style.setProperty('visibility','hidden');
}
function hideDealBtn() {
    btnDeal.style.setProperty('visibility', 'hidden');
}
function hideBetButtons() {
    betBtnsGroup.style.setProperty('visibility', 'hidden');
}
function showBetButtons() {
    betBtnsGroup.style.setProperty('visibility', 'visible')
}

function showPlayAgain() {
    btnPlayAgain.style.setProperty('visibility', 'visible');
}