function Transition() {
    this.setup = function () {
        bg = this.sceneManager.background;
    }

    this.enter = function () {
        const sm = this.sceneManager;
        $("#menu").show();

        $("#menuContainer").append(
            $("<div></div>").css({
                display: "none",
                position: "absolute",
                top: "8px",
                width: "800px",
                height: "600px",
                // background: `${bg}`,
                background: `black`,
            }).attr('id', 'transition')
        );

        $("#transition").fadeIn(1000,  () => {
            $("#transition").fadeOut(500, () => {
                sm.showScene(Game);
            })
        });
        


    }

    this.draw = function () {

    }
}