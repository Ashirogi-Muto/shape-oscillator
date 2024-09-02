import { Container, Graphics, Renderer } from "pixi.js";
import { Eye } from "./Eye";

interface LimbConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

interface EyeConfig {
  x: number;
  y: number;
  radius: number;
}

interface ShapeConfig {
  type?: string;
  body: {
    middle: (g: Graphics) => void;
    shadow: (g: Graphics) => void;
  };
  arms: {
    left: LimbConfig;
    right: LimbConfig;
  };
  eyes: {
    x: number;
    y: number;
    gap: number;
    radius: number;
  };
  colour?: string;
}

export class Shape {
  renderer: Renderer;
  mainContainer: Container;
  shapeConfig: ShapeConfig;
  dragging: boolean;
  dragData: any;

  constructor(renderer: Renderer, shapeConfig: ShapeConfig) {
    this.shapeConfig = {
      type: "sine",
      colour: "#3AC16F",
      ...shapeConfig,
    };
    this.mainContainer = new Container();
    this.renderer = renderer;
    this.dragging = false;
    this.renderShape();
  }

  private makeBody() {
    this.mainContainer.x = 0;
    this.mainContainer.y = 0;
    const shadow = new Graphics();
    this.shapeConfig.body.shadow(shadow);
    const arms = {
      leftArm: this.getLimb(this.shapeConfig.arms.left),
      rightArm: this.getLimb(this.shapeConfig.arms.right),
    };
    const legs = {
      leftLeg: this.getLimb({
        x: 150,
        y: 320,
        width: 25,
        height: 50,
        radius: 30,
      }),
      rightLeg: this.getLimb({
        x: 220,
        y: 320,
        width: 25,
        height: 50,
        radius: 30,
      }),
    };
    const body = new Graphics();
    this.shapeConfig.body.middle(body);
    this.mainContainer.addChild(body);
    const armContainer = new Graphics();
    armContainer.addChild(arms.leftArm, arms.rightArm);
    const legContainer = new Graphics();
    legContainer.addChild(legs.leftLeg, legs.rightLeg);
    this.mainContainer.addChild(armContainer);
    this.mainContainer.addChild(legContainer);
    this.mainContainer.addChild(shadow);
    const eyeContainer = new Graphics();
    const sharedMask = new Graphics();
    new Eye(
      eyeContainer,
      { ...this.shapeConfig.eyes, gap: undefined },
      sharedMask
    );
    new Eye(eyeContainer, { ...this.shapeConfig.eyes }, sharedMask);
    eyeContainer.zIndex = 3;
    this.mainContainer.addChild(eyeContainer);

    const face = new Graphics();
    face.roundRect(190, 300, 20, 10);
    face.fill("#fff");
    face.zIndex = 2;
    this.mainContainer.addChild(face);

    // sharedMask.rect(160, 240, 80, 40);
    // sharedMask.fill(this.shapeConfig.colour);
    sharedMask.scale.y = 1;
    this.mainContainer.position.y = 400;
    this.mainContainer.interactive = true;
    this.mainContainer.on("pointerdown", this.onDragStart.bind(this));
    this.mainContainer.on("pointerup", this.onDragEnd.bind(this));
    this.mainContainer.on("pointerupoutside", this.onDragEnd.bind(this));
    this.mainContainer.on("pointermove", this.onDragMove.bind(this));
    this.mainContainer.addChild(sharedMask);
  }

  private onDragStart(event: any) {
    console.log("drag start", event);
    this.dragging = true;
    this.dragData = event;

    // Store the initial position
    const newPosition = this.dragData.data.getLocalPosition(this.mainContainer);
    this.mainContainer.alpha = 0.5; // Optional: Change appearance during drag
    this.mainContainer.pivot.set(newPosition.x, newPosition.y);
    this.mainContainer.position.set(
      this.dragData.data.global.x,
      this.dragData.data.global.y
    );
  }

  private onDragEnd() {
    console.log("onDragEnd");
    this.dragging = false;
    this.dragData = null;
    this.mainContainer.alpha = 1; // Reset appearance
  }

  private onDragMove() {
    console.log("onDragMove");
    if (this.dragging) {
      const newPosition = this.dragData!.data.getLocalPosition(
        this.mainContainer.parent
      );
      this.mainContainer.position.set(newPosition.x, newPosition.y);
    }
  }

  private getLimb(config: LimbConfig) {
    const { x, y, width, height, radius } = config;
    const limb = new Graphics();
    limb.roundRect(x, y, width, height, radius);
    limb.fill(this.shapeConfig.colour);
    return limb;
  }

  renderShape() {
    this.makeBody();
  }

  resize(viewboxWidth: number, viewboxHeight: number) {
    // Scale the shape based on the viewbox dimensions
    const scale = Math.min(
      viewboxWidth / 800, // Original width
      viewboxHeight / 600 // Original height
    );
    this.mainContainer.scale.set(scale);

    // Center the shape within the viewbox
    this.mainContainer.position.set(
      (viewboxWidth - this.mainContainer.width) / 2,
      (viewboxHeight - this.mainContainer.height) / 2
    );
  }
}
