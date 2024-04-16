import {
  CanvasRenderer,
  UpdateFunction,
  createCanvasRenderer,
} from "./rendering/WebGLRenderer";

import * as twgl from "twgl.js";

//@ts-ignore
import EFFECT_FRAG from "./EffectGL.frag";
//@ts-ignore
import EFFECT_VERT from "./EffectGL.vert";

const mouse = { x: 0, y: 0 };
window.addEventListener("pointermove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const init = async ({ gl, canvas }: CanvasRenderer) => {
  // init webgl
  const program = twgl.createProgramFromSources(gl, [EFFECT_VERT, EFFECT_FRAG]);
  const programInfo = twgl.createProgramInfoFromProgram(gl, program);

  const arrays = {
    a_position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  return { programInfo, bufferInfo };
};

const update: UpdateFunction<typeof init> = (renderer, frame, programState) => {
  const { gl, canvas } = renderer;
  const { elapsed, delta } = frame;
  const { programInfo, bufferInfo } = programState;

  const uniforms = {
    u_resolution: [canvas.width, canvas.height],
    u_delta: delta,
    u_time: elapsed,
    u_mouse: [mouse.x, mouse.y],
    // uNoiseOffset: [noiseOffset.current.x, noiseOffset.current.y],
    // uCheckerSize: checkerSize.current,
  };

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);
};

createCanvasRenderer({
  elm: document.body,
  init,
  update,
});
