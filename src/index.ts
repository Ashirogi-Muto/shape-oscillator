import { autoDetectRenderer, Container, Ticker, Renderer } from "pixi.js";
import { Shape } from "./Shape";
import shapeConfig from "./shapesConfig";

interface SimpleOscillatorOptions {
  renderer: Renderer;
  fullscreen: boolean;
  width: number;
  height: number;
  viewboxWidth: number;
  viewboxHeight: number;
}

class SimpleOscillator {
  renderer: Renderer;
  stage: Container;
  viewbox: Container;
  viewboxWidth: number;
  viewboxHeight: number;
  width: number;
  height: number;
  fullscreen: boolean;
  shape: Shape | null = null;

  constructor(opts: SimpleOscillatorOptions) {
    this.width = opts.width;
    this.height = opts.height;
    this.renderer = opts.renderer;
    this.stage = new Container();
    this.viewbox = new Container();
    this.viewboxWidth = opts.viewboxWidth;
    this.viewboxHeight = opts.viewboxHeight;
    this.fullscreen = opts.fullscreen;
    this.stage.addChild(this.viewbox);
    this.initializeRenderer();
  }

  async initializeRenderer() {
    document
      .getElementById("container")
      ?.appendChild(this.renderer.view.canvas as HTMLCanvasElement);

    if (this.fullscreen) {
      window.addEventListener("resize", this.resizeFullscreen.bind(this));
      this.resizeFullscreen();
    } else {
      this.setSize(this.width, this.height);
    }
    window.addEventListener("resize", this.updateViewbox.bind(this));
    this.updateViewbox();

    globalThis.__PIXI_STAGE__ = this.stage;
    globalThis.__PIXI_RENDERER__ = this.renderer;
    this.initializeOscillator();
  }

  private resizeFullscreen() {
    this.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  private updateViewbox() {
    console.log(this.width, this.height);
    this.viewbox.position.set(this.width / 2, this.height / 2);

    const scale = Math.min(
      this.width / this.viewboxWidth,
      this.height / this.viewboxHeight
    );
    this.viewbox.scale.set(scale);
    if (this.shape) {
      this.shape.resize(this.viewboxWidth, this.viewboxHeight);
    }
    this.render();
  }

  private setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    if (this.renderer) {
      this.renderer.resize(width, height);
      const canvasStyle = this.renderer.view.canvas.style;
      if (canvasStyle) {
        canvasStyle.width = width + "px";
        canvasStyle.height = height + "px";
      }
      this.render();
    }
  }

  render() {
    this.renderer.render(this.stage);
  }

  initializeOscillator() {
    for (const config of shapeConfig) {
      const newShape = new Shape(this.renderer, config);
      this.stage.addChild(newShape.mainContainer);
    }
    this.render();
  }
}

async function main() {
  const renderer = await autoDetectRenderer({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: window.devicePixelRatio < 2,
    resolution: window.devicePixelRatio,
    background: "#fff",
  });
  const options: SimpleOscillatorOptions = {
    fullscreen: true,
    viewboxWidth: 1100 * 1.1,
    viewboxHeight: 1600 * 1.1,
    renderer,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  new SimpleOscillator(options);
}

main();
