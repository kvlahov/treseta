class Team {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
    }

    getTeamScore() {
        return this.player1.getScore() + this.player2.getScore();
    }

    getTeamName() {
        return "Tim se sastoji od igrača: " + this.player1.id + " i igrača: " + this.player2.id;
    }

    getFormatedScore() {
        var score = Math.floor(this.getTeamScore() / 3);
        var fromatReminder = "bele";
        var formatScore = "punata";
        
        if(score == 1){
            formatScore = "punat";
        } else if(score > 1 && score < 5){
            formatScore = "punta";
        }

        var bele = this.getTeamScore() % 3;
        switch (bele) {
            case 0:
                fromatReminder = '';
                break;
            case 1:
                fromatReminder = "bela";
                break;
            case 2:
                break;
        }
        if(fromatReminder){
            return `${score} ${formatScore} i ${bele} ${fromatReminder}`;
        } else {
            return `${score} ${formatScore}`;
        }
    }
}