import { Application, Container, Renderer } from "pixi.js";

export {};

interface Person {
  __PIXI_RENDERER__: Renderer;
  __PIXI_STAGE__: Container;
}

declare global {
  var __PIXI_RENDERER__: Renderer;
  var __PIXI_STAGE__: Container;
}
