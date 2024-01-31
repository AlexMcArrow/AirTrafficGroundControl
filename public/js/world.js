class World {
    constructor() {
        this.run = false;
        this.canvas = document.getElementById("viewport");
        this.ctx = this.canvas.getContext("2d");

        this.#windowSize();

        this.ground = new Ground();
        this.ground.addPoint(100, 100);
        this.ground.addPoint(200, 200);

        this.#bind();
        this.draw();
    }
    #windowSize() {
        this.canvas.height = document.body.clientHeight - 2;
        this.canvas.width = document.body.clientWidth - 2;
    }
    #bind() {
        window.addEventListener('resize', debounce(() => {
            this.#windowSize();
            this.draw();
        }))
    }
    start() {
        this.run = true;
    }
    stop() {
        this.run = false;
    }
    draw() {
        this.ctx.fillStyle = "#005500";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ground.draw(this.ctx);
        if (this.run) {
            
        }
        requestAnimationFrame(() => { this.draw() });
    }
}