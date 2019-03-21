function Animation() {
    let object;
    let destination;
    let sender;
    let senderArgs;

    this.enter = () => {
        senderArgs = this.sceneArgs.senderArgs;
        object = this.sceneArgs.object;
        destination = this.sceneArgs.destination;
        sender = this.sceneArgs.sender;
        print(this.sceneManager);
    }

    this.draw = () => {
        // background(this.sceneArgs.bg);

        if (object.x < destination.x) {
            object.x++;
        }
        if (object.x > destination.x) {
            object.x--;
        }

        if (object.x == destination.x && object.y == destination.y) {
            this.sceneManager.showScene(sender, senderArgs);
        }
        object.show();
    }
}