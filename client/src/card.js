class Card {
    //da ispadne 20 razmaka na 800x600
    //x = Math.floor(canvasWidth*0.025), y = canvasHeight - cardH
    constructor(value, suit, img = 0, x = cardDefaultX, y = cardDefaultY) {
        this.value = value;
        this.suit = suit;
        this.img = img;

        this.originalX = 0;
        this.originalY = 0;
        this.x = x;
        this.y = y;
        this.width = cardW;
        this.height = cardH;
        this.drawLast = false;
    }

    getCardName() {
        return this.value.toString() + this.suit;
    }

    isStronger(other) {
        return (this.calculateStrength() > other.calculateStrenght());
    }

    calculateStrength() {
        var strength;
        if (this.value <= 3) {
            strength = map(this.value, 3, 1, 10, 8);
        } else {
            strength = map(this.value, 13, 4, 7, 1)
        }
        return strength;
    }

    mouseInCard() {
        if (mouseX > this.x && mouseX < this.x + this.width 
            && mouseY > this.y && mouseY < this.y + this.height) {
            return true;
        } else {
            return false;
        }
    }

    //1 punat = 3 points
    //1 bela = 1 point
    getCardPoints() {
        if (this.value == 1) {
            return 3;
        } else if ((this.value >= 11 && this.value <= 13) || this.value == 2 || this.value == 3) {
            return 1;
        }
        return 0;
    }

    show() {
        image(this.img, this.x, this.y, this.width, this.height);
    }

    hover() {
        if (this.mouseInCard() && humanPlayer.isLegit(this)) {
            this.y = this.originalY - 10;
            this.height = cardH * 1.1;
            this.drawLast = true;
        } else {
            this.y = this.originalY;
            this.height = cardH;
            this.drawLast = false;
        }
    }

    increaseSize() {
        this.x = this.originalX - 3;
        this.y = this.originalY - 10;
        this.width = cardW * 1.1;
        this.height = cardH * 1.1;
        this.drawLast = true;
    }

    returnToOriginal() {
        this.x = this.originalX;
        this.width = cardW;
        this.y = this.originalY;
        this.height = cardH;
        this.drawLast = false;
    }

    isOverlaping(other) {
        //l1 - upper left corner, r1 - bottom right corner
        let l1 = {
            x: this.x,
            y: this.y
        };
        let r1 = {
            x: this.x + this.width,
            y: this.y + this.height
        };
        let l2 = {
            x: other.x,
            y: other.y
        };
        let r2 = {
            x: other.x + other.width,
            y: other.y + other.height
        };

        //if one rectangle is to the left of other
        if (l1.x > r2.x || l2.x > r1.x) {
            return false;
        }

        // If one rectangle is above other  
        if (l1.y > r2.y || l2.y > r1.y) {
            return false;
        }

        return true;
    }

    //returns true if this.drawLast == false and mouse is in this,
    // except if mouse is in intersection of this and other
    mouseOnTopRectangle(other) {
        if (this.isOverlaping(other)) {
            if (this.mouseInCard() && other.mouseInCard()) {
                if (this.drawLast) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return this.mouseInCard();
            }
        } else {
            return this.mouseInCard();
        }
    }
}