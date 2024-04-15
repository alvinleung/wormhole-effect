import {
  CanvasRenderer,
  UpdateFunction,
  createCanvasRenderer,
} from "./rendering/CanvasRenderer";

const init = async ({ canvas, context }: CanvasRenderer) => {
  return {};
};

const update: UpdateFunction<typeof init> = (canvasRenderer, state) => {};

createCanvasRenderer({
  elm: document.body,
  init,
  update,
});
