import { Container, Graphics, Ticker } from "pixi.js";
import gsap from "gsap";

interface EyeOptions {
  x: number;
  y: number;
  gap?: number;
  radius: number;
}

export class Eye {
  eye: Graphics;
  blinkTimeline: GSAPTimeline;
  mask: Graphics;
  constructor(
    constainer: Container,
    options: EyeOptions,
    sharedMask: Graphics
  ) {
    this.eye = new Graphics();
    this.blinkTimeline = gsap.timeline();
    this.mask = sharedMask;
    this.render(constainer, options);
  }
  render(container: Container, options: EyeOptions) {
    const { x, y, radius, gap } = options;
    this.eye.circle(x + (gap ?? 0), y, radius);
    this.eye.fill("#fff");

    // this.eye.mask = this.mask;

    container.addChild(this.eye);
  }

  static blink(mask: Graphics) {
    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: Eye.getRandomDelay(),
    });
    timeline
      .to(mask.scale, { y: 0, duration: 0.1, ease: "power1.inOut" })
      .to(mask.scale, {
        y: 1,
        duration: 0.1,
        ease: "power1.inOut",
        delay: 0.1,
      });

    timeline.eventCallback("onRepeat", () => {
      const a = Eye.getRandomDelay();
      timeline.repeatDelay(a);
      console.log("onRepeat", a);
    });
  }

  static getRandomDelay(): number {
    return Math.random() * 4 + 0.5; // Random delay between 0.5 to 4.5 seconds
  }
}
