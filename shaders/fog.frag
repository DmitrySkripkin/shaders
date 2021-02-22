#include <noise>
#define NUM_OCTAVES 5
uniform float u_time;
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * cnoise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

varying vec3 vPosition;
void main () {
  vec2 st = gl_FragCoord.xy/80.0;
  // st += st * abs(sin(u_time*0.1)*3.0);
  vec3 color = vec3(0.0);

  vec2 q = vec2(0.);
  q.x = fbm(st + 0.00 * u_time);
  q.y = fbm(st + vec2(1.0));

  vec2 r = vec2(0.);
  r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
  r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

  float f = fbm(st + r);

  color = mix(vec3(0.901961, 0.619608, 0.666667),
              vec3(0.66667, 0.666667, 0.498039),
              clamp((f * f) * 4.0, 0.0, 1.0));

  color = mix(color,
              vec3(0.9, 0, 0.164706),
              clamp(length(q), 0.0, 1.0));

  color = mix(color,
              vec3(0.66667, 1, 1),
              clamp(length(r.x), 0.0, 1.0));

  gl_FragColor = vec4(f * color, 1.);
}