class World {
   constructor(
      graph,
      roadWidth = 70,
      roadRoundness = 10,
      buildingWidth = 150,
      buildingMinLength = 150,
      spacing = 50,
      treeSize = 160
   ) {
      this.graph = graph;
      this.roadWidth = roadWidth;
      this.roadRoundness = roadRoundness;
      this.buildingWidth = buildingWidth;
      this.buildingMinLength = buildingMinLength;
      this.spacing = spacing;
      this.treeSize = treeSize;

      this.envelopes = [];
      this.roadBorders = [];
      this.buildings = [];
      this.trees = [];
      this.laneGuides = [];

      this.markings = [];

      this.frameCount = 0;

      this.generate();
   }

   static load(info) {
      const world = new World(new Graph());
      world.graph = Graph.load(info.graph);
      // world.roadWidth = info.roadWidth;
      // world.roadRoundness = info.roadRoundness;
      // world.buildingWidth = info.buildingWidth;
      // world.buildingMinLength = info.buildingMinLength;
      // world.spacing = info.spacing;
      // world.treeSize = info.treeSize;
      // world.envelopes = info.envelopes.map((e) => Envelope.load(e));
      // world.roadBorders = info.roadBorders.map((b) => new Segment(b.p1, b.p2));
      // world.buildings = info.buildings.map((e) => Building.load(e));
      // world.trees = info.trees.map((t) => new Tree(t.center, info.treeSize));
      // world.laneGuides = info.laneGuides.map((g) => new Segment(g.p1, g.p2));
      world.generate();
      world.markings = info.markings.map((m) => Marking.load(m));
      world.zoom = info.zoom;
      world.offset = info.offset;
      return world;
   }

   save() {
      return {
         graph: this.graph,
         markings: this.markings,
         zoom: this.zoom,
         offset: this.offset,
      };
   }

   generate() {
      this.envelopes.length = 0;
      for (const seg of this.graph.segments) {
         this.envelopes.push(
            new Envelope(seg, this.roadWidth, this.roadRoundness)
         );
      }

      this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
      // this.buildings = this.#generateBuildings();
      // this.trees = this.#generateTrees();

      this.laneGuides.length = 0;
      this.laneGuides.push(...this.#generateLaneGuides());
   }

   #generateLaneGuides() {
      const tmpEnvelopes = [];
      for (const seg of this.graph.segments) {
         tmpEnvelopes.push(
            new Envelope(seg, this.roadWidth / 2, this.roadRoundness)
         );
      }
      const segments = Polygon.union(tmpEnvelopes.map((e) => e.poly));
      return segments;
   }

   #getIntersections() {
      const subset = [];
      for (const point of this.graph.points) {
         let degree = 0;
         for (const seg of this.graph.segments) {
            if (seg.includes(point)) {
               degree++;
            }
         }

         if (degree > 2) {
            subset.push(point);
         }
      }
      return subset;
   }

   #updateLights() {
      const lights = this.markings.filter((m) => m instanceof Light);
      const controlCenters = [];
      for (const light of lights) {
         const point = getNearestPoint(light.center, this.#getIntersections());
         let controlCenter = controlCenters.find((c) => c.equals(point));
         if (!controlCenter) {
            controlCenter = new Point(point.x, point.y);
            controlCenter.lights = [light];
            controlCenters.push(controlCenter);
         } else {
            controlCenter.lights.push(light);
         }
      }
      const greenDuration = 2,
         yellowDuration = 1;
      for (const center of controlCenters) {
         center.ticks = center.lights.length * (greenDuration + yellowDuration);
      }
      const tick = Math.floor(this.frameCount / 60);
      for (const center of controlCenters) {
         const cTick = tick % center.ticks;
         const greenYellowIndex = Math.floor(
            cTick / (greenDuration + yellowDuration)
         );
         const greenYellowState =
            cTick % (greenDuration + yellowDuration) < greenDuration
               ? "green"
               : "yellow";
         for (let i = 0; i < center.lights.length; i++) {
            if (i == greenYellowIndex) {
               center.lights[i].state = greenYellowState;
            } else {
               center.lights[i].state = "red";
            }
         }
      }
      this.frameCount++;
   }

   draw(ctx, viewPoint) {
      this.#updateLights();

      for (const env of this.envelopes) {
         env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
      }
      for (const marking of this.markings) {
         marking.draw(ctx);
      }
      for (const seg of this.graph.segments) {
         seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
      }
      for (const seg of this.roadBorders) {
         seg.draw(ctx, { color: "white", width: 4 });
      }

      const items = [...this.buildings, ...this.trees];
      items.sort(
         (a, b) =>
            b.base.distanceToPoint(viewPoint) -
            a.base.distanceToPoint(viewPoint)
      );
      for (const item of items) {
         item.draw(ctx, viewPoint);
      }
   }
}
