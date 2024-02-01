class Parking extends Marking {
   constructor(center, directionVector, width, height) {
      super(center, directionVector, width, height);

      this.borders = [this.poly.segments[0], this.poly.segments[2]];
      this.type = "parking";
   }

   draw(ctx) {
      for (const border of this.borders) {
         border.draw(ctx, { width: 5, color: "blue" });
      }
      ctx.save();
      ctx.translate(this.center.x, this.center.y);
      ctx.rotate(angle(this.directionVector) - 1.570796326795);

      ctx.beginPath();
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = "blue";
      ctx.font = "bold " + this.height * 0.9 + "px Arial";
      ctx.fillText("P", 2, 3);

      ctx.restore();
   }
}