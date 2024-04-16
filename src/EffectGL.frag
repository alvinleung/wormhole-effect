#ifdef GL_ES

precision mediump float;

#endif

uniform vec2 u_resolution;
uniform float u_delta;
uniform float u_time;
uniform vec2 u_mouse;

// our textures coming from p5
uniform sampler2D tex0;


// Noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
float noise(vec3 P) {
    vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));
    vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);
    vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);
    vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;
    vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0); gx1 = fract(gx1);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),
        g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),
        g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),
        g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));
    vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));
    g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;
    g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;
    vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),
        dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),
        vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),
            dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);
    return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);
}
float noise(vec2 P) { return noise(vec3(P, 0.0)); }

float centerPulse(vec2 offsetFromOrigin, float rot, float pulseSpeed) {
    float rotNoiseSeed = rot * u_time * pulseSpeed * 0.2;
    float rotNoise = noise(vec2(rotNoiseSeed * 5.0, 1.0));

    // float pulseSpeed = 0.005; // constant speed
    float pulse = sin(u_time * 0.02 + distance(vec2(1,1) * .5 * rotNoise, offsetFromOrigin) * 10.0);

    return pulse;
}

float centerStripe(vec2 offsetFromOrigin, float rot, float rotationSpeed, float lineInterval) {
    float stripeColor = mod(degrees(u_time * rotationSpeed + rot), lineInterval);
    return stripeColor;
}

float pulsingStripe(vec2 offsetFromOrigin, float rot, float rotationSpeed, float pulseSpeed, float lineInterval) {
    float pulse = centerPulse(offsetFromOrigin, rot, pulseSpeed);
    float stripeColor = centerStripe(offsetFromOrigin, rot, rotationSpeed, lineInterval);
    return pulse + stripeColor;
}

vec4 pulsingStripeWithOffset(vec2 offsetFromOrigin, float rot, float pulseOffset, float widthFactor) {
    float rotationSpeed = 0.00001;

    float outputColor = pulsingStripe(offsetFromOrigin, rot, rotationSpeed * pulseOffset, 0.001 * pulseOffset, 10.0 * widthFactor);
    float outputColor2 = pulsingStripe(offsetFromOrigin, rot, rotationSpeed * pulseOffset, 0.002 * pulseOffset, 10.0 * widthFactor);
    float outputColor3 = pulsingStripe(offsetFromOrigin, rot, rotationSpeed * pulseOffset * 0.5, 0.003 * pulseOffset, 5.0 * widthFactor);

    float clampingPulse = pulsingStripe(offsetFromOrigin, rot, rotationSpeed, 0.002, 200.0);

    return vec4(outputColor* clampingPulse, outputColor2* clampingPulse,outputColor3* clampingPulse, 1.0);
}


void main() {
    vec2 coord = (gl_FragCoord.xy / u_resolution.xy); 

    // generate stripe
    float maxAxis = max(u_resolution.x, u_resolution.y);
    // If you want to map the pixel coordinate values to the range 0 to 1, you divide by resolution.
    
    /*With vec4 gl_FragCoord, we know where a thread is working inside the billboard. 
    In this case we don't call it uniform because it will be different from thread to thread, 
    instead gl_FragCoord is called a varying. */
    vec2 uv = gl_FragCoord.xy / maxAxis;
    vec2 center = 0.5 * u_resolution / maxAxis;

    vec2 offsetFromOrigin = vec2(uv.y-center.y, uv.x-center.x);
    float rot = atan(offsetFromOrigin.y ,offsetFromOrigin.x);

    vec4 s1 = pulsingStripeWithOffset(offsetFromOrigin, rot, 5.4, 0.3);
    vec4 s2 = pulsingStripeWithOffset(offsetFromOrigin, rot, 4.1, 0.9);
    // vec4 s3 = pulsingStripeWithOffset(uv, center, 3.0, 2.0);
    // vec4 s4 = pulsingStripeWithOffset(offsetFromOrigin, rot, 2.0, 1.0);
    // vec4 s5 = pulsingStripeWithOffset(uv, center, 5.2, 5.0);
    // vec4 s6 = pulsingStripeWithOffset(uv, center, 6.5, 10.0);

    // vec4 s7 = pulsingStripeWithOffset(uv, center, 10.0, 30.0);

    // gl_FragColor = vec4(vec3(pulsingStripe(offsetFromOrigin, rot, 0.0001, 0.005, 10.0)), 1.0);
    
    gl_FragColor = vec4(vec3(
        // centerPulse(offsetFromOrigin, rot, 0.02),
        centerPulse(offsetFromOrigin, rot, 0.02)
        // centerPulse(offsetFromOrigin, rot, 0.6)
    ), 10.0);
    // gl_FragColor = vec4(2.0) - (s7 * s6 * s1 * s4 * s2);
    // gl_FragColor = vec4(2.0) - (s1 * s2);

    return;

    // gl_FragColor = vec4(
    //     1.0 - noise(vec2(pulse)), 
    //     0.0,
    //     1.0 - noise(vec2(pulse)),
    //     1.0) * outputColor;
}
