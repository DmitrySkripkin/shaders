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

float circle(vec2 pt, vec2 center, float radius, float edge_thickness) {
  vec2 p = pt - center;
  float len = length(p);
  radius = radius + cnoise(pt * 1.5 + u_time) / 20.0;
  return smoothstep(radius + edge_thickness, radius, len);
}

vec3 mixColors(vec3 colors[4]) {
  vec3 color1 = colors[0];
  vec3 color2 = colors[1];
  vec3 color3 = colors[2];
  vec3 color4 = colors[3];
  return cos(max(max(max(color1, color2), color3), color4)) + sin(min(min(min(color1, color2), color3), color4));
}

void main (void) {
  vec3 position = vPosition;
  vec2 _center = vec2(-0.55, -0.55);
  vec2 center = _center;
  vec3 color1 = vec3(0.0);
  vec3 color2 = vec3(0.0);
  vec3 color3 = vec3(0.0);
  vec3 color4 = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    center.x = _center.x;
    for (int j = 0; j < 5; j++) {
      color1 += vec3(0.23302341635537208, 0.424014939415586, 0.5600182465419986) * circle(position.xy, center, 0.15, 0.1);
      color2 += vec3(0.28072520896038555, 0.6140134809418756, 0.5258182737338032) * circle(position.xy + 0.1, center, 0.16, 0.1);
      color3 += vec3(0.47020856092037067, 0.7238028823444491, 0.4704412500767928) * circle(position.xy + 0.2, center, 0.17, 0.1);
      color4 += vec3(0.729479560689575, 0.766664420943253, 0.5365999945736162) * circle(position.xy, center, 0.18, 0.1);
      center.x += 0.45 + (cnoise(position.xy + u_time) / 1.0);
    }
    center.y += 0.45 + (cnoise(position.xy + u_time) / 1.0);
  }
  // vec3 a[4];
  // a[0] = color1;
  // a[1] = color2;
  // a[2] = color3;
  // a[3] = color4;

  // if (fract(gl_FragCoord.x / 3.0) < 0.2) {
  //   gl_FragColor = vec4(vec3(1.0) - randomizeColor(color1, 1.5), 1.0);
  // } else if (fract(gl_FragCoord.x / 3.0) < 0.7) {
  //   gl_FragColor = vec4(vec3(1.0) - randomizeColor(color2, 1.5), 1.0);
  // } else {
  //   gl_FragColor = vec4(vec3(1.0) - randomizeColor(color3, 1.5), 1.0);
  // }
  gl_FragColor = vec4(randomizeColor(color1 + color2 + color3 - color4, 2.5) , 1.0);
}