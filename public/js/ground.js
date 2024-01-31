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
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            new Circle(ctx, point['x'], point['y'], 5, 'white');
        }
    }
}