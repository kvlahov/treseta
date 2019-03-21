class Test {
    constructor() {
        this.deck = [];
        this.board = [];
    }

    setup = () => {
        this.images = this.sceneArgs.images;
        let tempImages = [...images];
        for (var j in suits) {
            for (var i = 13; i > 0; i--) {
                if (i == 8 || i == 9 || i == 10) {
                    continue;
                }
                this.deck.push(new Card(i, suits[j], tempImages.shift()));
            }
        }
        let shuffled = shuffle(this.deck);
        humanPlayer = new Player(shuffled.splice(0, 10), 1, [0, 1]);
        humanPlayer.sortHand();
    };

    enter = () => {
        print(humanPlayer);
        print(humanPlayer.hand.entries())
    };


    draw = () => {
        background(this.sceneArgs.bg);

        for (const [index, card] of humanPlayer.hand.entries()) {
            card.x = index*75
            card.show();
        }
        for(const card of this.board) {
            card.show();
        }
    };

    mousePressed() {
        for(const card of humanPlayer.hand) {
            if(card.mouseInCard()){
                this.board.push(card);

                humanPlayer.hand = humanPlayer.hand.filter(item => item.getCardName() != card.getCardName());
                let destination = {x: 400, y: 200};
                let sender = this.sceneManager.scene.fnScene;
                this.sceneManager.showScene(Animation, {senderArgs: this.sceneArgs, sender, object: card, destination, bg: bg}, );
            }
        }
    }

    shuffle(originalArray) {
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
}

