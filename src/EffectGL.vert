#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
 

attribute vec4 a_position;
uniform float u_scroll;

varying vec3 vVertexPosition;

void main() {
  gl_Position = vec4(a_position.x,a_position.y, a_position.z,a_position.w);

  vVertexPosition = a_position.xyz;
}