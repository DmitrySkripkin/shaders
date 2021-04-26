#include <noise>
uniform float u_time;

varying vec2 vUv;
varying vec3 vPosition;
#define NUM_OCTAVES 1
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
  vec3 position = vPosition;
  float radius = 0.8;
  float time = u_time - (length(position) / 1.0);
  float a = dot(vec2(cos(time * 7.0) * radius, sin(time / 2.0) * radius), position.xy / 2.0);
  a = a * 8.2;
  vec3 color = vec3(0.9, 0.8, 0.7);
  float rad = 3.6;
  // vec2 coord = gl_FragCoord.xy;
  vec2 coord = position.xy;
  vec2 st = coord * a / 1.7; /// (80.0 * length(position.y + 1.0));
  vec2 q = vec2(0.0);
  q.x = fbm(st);
  q.y = fbm(st + vec2(1.0));
  vec2 r = vec2(0.);
  r.x = fbm(st + 1.0);
  r.y = fbm(st * q);
  float f = fbm(st + q + length((position.xy)) + (time * 1.4)) + length(position.xy * rad);
  // float g = fbm(st + (q * 2.0) + time + length((position.xy + 0.15)) + time);
  color = mix(vec3(0.1, 0.1, 0.1),
              vec3(1.6, 0.5, 0.1),
              clamp(1.0, 1.0, 1.0));

  color = mix(color,
              vec3(0.1, 0.1, 1.2),
              clamp(length(q), 0.0, 1.0));

  color = mix(color,
              vec3(0.1, 0.2, 1.4),
              clamp(length(r.x), 0.0, 1.0));
  f = f * cos(f * (0.9 - (u_time / 500.0))) + (a * circle(coord.xy, vec2(0.0), 0.1, 0.09));
  color = vec3(0.1) + randomizeColor(color * f, 2.5);
  gl_FragColor = vec4(color, 1.0);
}