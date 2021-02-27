#include <noise>
uniform float u_time;

varying vec2 vUv;
varying vec3 vPosition;


float randc(vec2 co){ // some kind of  (-0.5, +0,5) / 2.5 rand
	return ((fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) - 0.5)) / 2.0;
}

vec3 randomizeColor (vec3 color) {
	color.r = color.r - randc(vPosition.xy + sin(u_time));
	color.g = color.g - randc(vPosition.xy + sin(u_time * 5.2));
	color.b = color.b - randc(vPosition.xy + sin(u_time * 1.4));
	return color;
}

float frequency = 2.1;
float noiseScale = 2.0;
float ringScale = 0.1;

vec3 color1 = vec3(0.4, 0.4, 0.4);
vec3 color2 = vec3(0.9, 0.7, 0.8);
void main (void) {
  vec2 position = vPosition.xy;
  vec2 wierd = vec2(length(position)) + (u_time / 10.0);
  float n = cnoise(position - (u_time / 5.0)) * cnoise(wierd + (u_time / 10.0));
  n = n * (1.0 - fract(dot(vec2(1.0, -1.0), position * 10.0) * 2.0));
  n = n * (1.0 - fract(dot(vec2(1.0, 0.0), position * 10.0) * 2.0));
  float ring = fract(frequency * (noiseScale * n));
  // float lerp = pow(ring, ringScale) + n;
  // vec3 color = mix(color1, color2, lerp);
  float avalue = step(0.6, ring);
  float bvalue = step(0.9, ring);
  float cvalue = avalue - bvalue;
  vec3 color = randomizeColor(color1 * cvalue);
  gl_FragColor = vec4(color, 1.0);
}