#include <noise>
uniform float u_time;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
varying vec2 vUv;
varying vec3 vPosition;


float rand(vec2 co) {
  return ((fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453)));
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

vec3 ngon(vec2 st, int N, float time) {
  float x = randc(st + sin(time), 10.0);
  float n = cnoise(st + time) * 0.2;
  st.x = abs(st.x) + (x);
  st.y = abs(st.y) + (x);
  // Angle and radius from the current pixel
  float a = atan(st.x, st.y)+PI;
  float r = TWO_PI/float(N)-abs(tan(time + x));

  // Shaping function that modulate the distance
  float d = cos(floor(.5+a/r)*r-a)*length(st);

  vec3 color = vec3(1.0 - smoothstep(0.4, 0.41, d));
  // color = vec3(d);
  return color;
}


void main (void) {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;
  // Remap the space to -1. to 1.
  st = st * 2.0 -1.0;
  if (fract(gl_FragCoord.x / 2.0) > 0.3) {
    vec3 ngon1 = ngon((st * 1.5), 5, u_time);
    vec3 ngon2 = ngon((st * 1.5), 1, u_time * 1.0);
    vec3 ngon3 = ngon((st * 2.0), 4, u_time * 1.0);
    vec3 ngon4 = ngon((st * 4.2), 3, u_time + randc(st * u_time, 0.1));
    ngon2.b = 0.2;
    ngon4.r = 0.01;
    gl_FragColor = vec4(randomizeColor((ngon1 - ngon2 * ngon3 + ngon4) / cos(st.y * 3.0), 2.5), 1.0);
  }
}