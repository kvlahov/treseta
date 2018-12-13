class Player {
    constructor(hand,id, direction = [0,0]) {
        this.hand = hand;
        this.id = id;
        this.score = 0;
        this.direction = direction;
    }
    
    getScore () {
        return this.score;
    }
    resetScore(){
        this.score = 0;
    }
    sortHand(){
        this.hand.sort(function (a,b) {
        var nameA = a.suit.toLowerCase();
        var nameB = b.suit.toLowerCase();
        
        if(nameA < nameB){
            return -1;
        } else if(nameA > nameB){
            return 1;
        } else{
            var strengthA = a.calculateStrength();
            var strengthB = b.calculateStrength();
            if(strengthA < strengthB) return -1;
            if(strengthA > strengthB) return 1;
            return 0;
        }
    });
    }
    
    playCard(){
        for(var card of this.hand){
            if(this.isLegit(card)){
                this.removeCard(card);
                return card;
            }
        }
    }
    
    isCurrent(){
        return this.id == current;
    }
    
    removeCard(card){
        var index = this.hand.findIndex(a => a.getCardName() == card.getCardName());
        if(index >= 0) {
            this.hand.splice(index, 1);
        }
    }
    
    hasWiningSuit() {
        for(var card of this.hand){
            if (card.suit == winingCard.card.suit){
                return true;
            }
        }
        return false;
    }
    
    isLegit(card){
        if(card.suit == winingCard.card.suit || winingCard.card.suit == 'none') {
            return true;
        } else {
            if(!this.hasWiningSuit()){
                return true;
            } else{
                return false;
            }
            
        } 
    }
}