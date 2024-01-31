class Ground {
    constructor() {
        this.points = [];
        this.lines = [];
    }
    addPoint(x, y) {
        this.points.push({
            x: x,
            y: y
        });
    }
    draw(ctx) {
        ctx.fillStyle = "#005500";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            new Circle(point['x'], point['y'], 5, 'white').draw(ctx);
        }
    }
}