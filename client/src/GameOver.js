function GameOver()
{
    let team1, team2, humanPlayer, showText;
    let oGame;

    this.setup = function()
    {
        oGame = this.sceneManager.findScene( Game ).oScene;
        console.log(oGame);
    }

    this.enter = function () {
        team1 = this.sceneArgs.team1;
        team2 = this.sceneArgs.team2;
        humanPlayer = this.sceneArgs.humanPlayer;
        showText = this.sceneArgs.showText;
    }

    this.draw = function()
    {
        const winner = (team1.getTeamScore() > team2.getTeamScore() ? team1 : team2);
        if (winner.player1 == humanPlayer || winner.player2 == humanPlayer) {
            showText("You won!", 'center');
            showText("Team score: " + winner.getFormatedScore(), 'lower');
        } else {
            showText("You Lost!", 'center');
            showText("Team score: " + team1.getFormatedScore(), 'lower');
        }
        $("#mmButton").show();
    }


}