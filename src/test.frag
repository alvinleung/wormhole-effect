#ifdef GL_ES

precision mediump float;

#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// grab texcoords from the vertex shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;


void main() {

    vec2 coord = (gl_FragCoord.xy / u_resolution.xy); 

    gl_FragColor = vec4(1.0,1.0,1.0,1.0);

}