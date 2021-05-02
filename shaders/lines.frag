#include <noise>
uniform float u_time;
uniform sampler2D u_texture;
varying vec2 vUv;
varying vec3 vPosition;


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

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
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

#define NUM_OCTAVES 10
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5; // 0.5
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
void main (void) {
  vec3 position = vPosition;
  float time = u_time * 2.0;
  vec2 coord = (position.xy) * 2.6;
  // coord.x = coord.x + u_time;
  float x = asin(coord.x + randc(coord.xx + time * 1.6, 10.0));
  float y = acos(coord.y + randc(coord.yy + time * 1.6, 10.0));
  coord = vec2(x, y);
  // coord = coord + snoise(coord - time);
  float fog = fbm(coord + fbm(coord + fbm(coord + time / 30.0)));
  float f = cos(cos(coord.x * coord.y + fog) + randc(coord, 5.0) + cnoise(coord * 10.0 + u_time));
  // coord = coord + cos(length(coord / 10.0));
  // float f2 = fbm(coord + fbm(coord + fbm(coord + u_time / 30.0)))
  // vec4 color2 = texture2D(u_texture, coord.xy * f);
  vec4 color = vec4(vec3(1.0) * (f * 2.0), 0.0);
  // vec4 color3 = vec4(vec3(1.0) * f * 5.0, 1.0);
  color = color * texture2D(u_texture, coord.xy);
  // color = vec4(vec3(1.0) * f * color.rgb, 1.0);
  gl_FragColor = vec4(vec3(0.0) + randomizeColor(color.rgb, 2.5), 1.0);
}