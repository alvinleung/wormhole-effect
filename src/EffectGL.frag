#ifdef GL_ES

precision mediump float;

#endif

uniform vec2 u_resolution;
uniform float u_delta;

// our textures coming from p5
uniform sampler2D tex0;


void main() {
    vec2 coord = (gl_FragCoord.xy / u_resolution.xy); 

    float color = sin(u_delta * 1.0);

    gl_FragColor = vec4(color,0.0,1.0,1.0);
}