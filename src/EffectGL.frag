#ifdef GL_ES

precision mediump float;

#endif

uniform vec2 u_resolution;
uniform float u_delta;
uniform float u_time;

// our textures coming from p5
uniform sampler2D tex0;


void main() {
    vec2 coord = (gl_FragCoord.xy / u_resolution.xy); 

    float color1 = sin(u_time * 0.001);
    float color2 = cos(u_time * 0.001);

    gl_FragColor = vec4(color1, color2,1.0,1.0);
}