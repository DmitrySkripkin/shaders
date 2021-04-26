#include <noise>
uniform float u_time;

varying vec2 vUv;
varying vec3 vPosition;
#define NUM_OCTAVES 5
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

float randc(vec2 co, float r) { // some kind of  (-0.5, +0,5) / 2.5 rand
  return ((fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) - 0.5)) / r;
}

vec3 randomizeColor (vec3 color, float r) {
  color = clamp(color, 0.0, 1.0);
  color.r = color.r + randc(vPosition.xy + sin(u_time), r);
  color.g = color.g + randc(vPosition.xy + sin(u_time * 3.2), r);
  color.b = color.b + randc(vPosition.xy + sin(u_time * 1.4), r);
  return color;
}

float circle(vec2 pt, vec2 center, float radius, float edge_thickness) {
  center.y = center.y + 0.1;
  vec2 p = pt - center;
  float len = length(p);
  // edge_thickness = edge_thickness * max(0.25, ((-pt.y * 1.7) - pt.x + 0.3) * 2.0 + snoise(pt * 1.5 + u_time));
  radius = radius + cnoise(pt * 1.4 - u_time) / 5.0;
  float result = 1.0 - smoothstep(radius + edge_thickness, radius, len);
  return result;
}


void main (void) {
  vec3 color = vec3(0.9, 0.8, 0.7);
  vec3 position = vPosition;
  float time = u_time;
  float rad = 2.0;
  // vec2 coord = gl_FragCoord.xy;
  vec2 coord = position.xy * (cos(length((position.xy) * 2.5)));
  vec2 st = coord * 5.0; /// (80.0 * length(position.y + 1.0));
  vec2 q = vec2(0.);
  q.x = fbm(st);
  q.y = fbm(st + vec2(1.0));
  // vec2 r = vec2(0.);
  // r.x = fbm(st + 1.0 * (q * cnoise(position.xy)) + 0.9 * time);
  // r.y = fbm(st + 1.0 * q + 0.8 * time);
  float f = fbm(st + q + time + length((position.xy + 0.15)) * (time / 3.0)) + length(position.xy * rad);
  // float g = fbm(st + (q * 2.0) + time + length((position.xy + 0.15)) + time);
  color = mix(vec3(0.0, 0.0, 0.0),
              vec3(1.0, 1.0, 1.0),
              clamp(1.0, 0.0, 1.0));

  // color = mix(color,
  //             vec3(0.3, 1.0, 0.164706),
  //             clamp(length(q), 0.0, 1.0));

  // color = mix(color,
  //             vec3(0.0, 0.0, 1.0),
  //             clamp(length(r.x), 0.0, 1.0));

  gl_FragColor = vec4(vec3(0.0) + randomizeColor(color * f, 2.5), 1.0);
}