#include <noise>
#define NUM_OCTAVES 5
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vUv;
varying vec3 vPosition;


float randc(vec2 co){ // some kind of  (-0.5, +0,5) / 2.5 rand
	return ((fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) - 0.5)) / 3.0;
}


mat2 getRotationMatrix(float theta){
  float s = sin(theta);
  float c = cos(theta);
  return mat2(c, -s, s, c);
}

mat2 getScaleMatrix(float scale){
  return mat2(scale, 0, 0, scale);
}

float rect(vec2 pt, vec2 anchor, vec2 size, vec2 center){
  vec2 p = pt - center;
  vec2 halfsize = size * 0.5;
  float edge_thickness = 0.2 * max(0.25, ((-pt.y * 1.7) - pt.x + 0.3) * 2.0 + cnoise(pt * 1.5 + u_time));
  float horz = smoothstep(-halfsize.x - anchor.x - edge_thickness, -halfsize.x - anchor.x, p.x) - smoothstep(halfsize.x - anchor.x - edge_thickness, halfsize.x - anchor.x, p.x);
  float vert = smoothstep(-halfsize.y - anchor.y - edge_thickness, -halfsize.y - anchor.y, p.y) - smoothstep(halfsize.y - anchor.y - edge_thickness, halfsize.y - anchor.y, p.y);
  return horz * vert;
}

float circle(vec2 pt, vec2 center, float radius, float edge_thickness) {
  center.y = center.y + 0.1;
  vec2 p = pt - center;
  float len = length(p);
  edge_thickness = edge_thickness * max(0.25, ((-pt.y * 1.7) - pt.x + 0.3) * 2.0 + cnoise(pt * 1.5 + u_time));
  radius = radius + cnoise(pt * 1.4 - u_time) / 50.0;
  float result = 1.0 - smoothstep(radius + edge_thickness, radius, len);
  return result;
}


vec3 randomizeColor (vec3 color) {
	color.r = color.r + randc(vPosition.xy + sin(u_time));
	color.g = color.g + randc(vPosition.xy + sin(u_time * 5.2));
	color.b = color.b + randc(vPosition.xy + sin(u_time * 1.4));
	return color;
}

void main (void) {
  vec2 position = vPosition.xy;

  float circle1 = circle(position, vec2(0.0, 0.0), 0.35, 0.25);
  float circle2 = circle(position, vec2(0.03, 0.1), 0.29, 0.25);
  float circle3 = circle(position, vec2(0.02, 0.18), 0.3, 0.25);

  vec3 color1 = vec3(0.2, 0.4, 0.85) * circle1;
  color1 = 0.28 - color1;

  vec3 color2 = vec3(0.75, 0.3, 0.6) * circle2;
  color2 = 1.0 - color2;

  vec3 color3 = vec3(0.9, 0.9, 0.9) * circle3;
  color3 = 1.0 - color3;


  color1 = randomizeColor(color1);
  color2 = randomizeColor(color2);
  color3 = randomizeColor(color3);

  gl_FragColor = vec4((color1 * color2 * color3 - color1) * -50.0, 1.0); 
}