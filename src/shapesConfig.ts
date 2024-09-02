import { Graphics } from "pixi.js";

const shapeConfig = [
  {
    type: "sine",
    body: {
      middle: function (g: Graphics) {
        g.ellipse(200, 250, 100, 100);
        g.fill("#3AC16F");
        g.zIndex = 1;
      },
      shadow: function (g: Graphics) {
        g.ellipse(200, 360, 90, 20);
        g.fill("#EFEFEF");
        g.zIndex = -1;
      },
    },
    eyes: {
      x: 180,
      y: 220,
      gap: 40,
      radius: 10,
    },
    arms: {
      left: {
        x: 65,
        y: 240,
        width: 30,
        height: 55,
        radius: 30,
      },
      right: {
        x: 305,
        y: 240,
        width: 30,
        height: 55,
        radius: 30,
      },
    },
  },
];

export default shapeConfig;
