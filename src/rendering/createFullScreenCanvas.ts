export function createFullScreenCanvas() {
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = 1080;
  canvas.style.display = "block";
  canvas.style.position = "fixed";
  canvas.style.inset = "0px";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
  });
  return canvas;
}
