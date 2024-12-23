import { fabric } from 'fabric';

export abstract class BaseTool {
  protected canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  abstract activate(): void;
  abstract deactivate(): void;
}
