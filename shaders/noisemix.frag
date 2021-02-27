#include <noise>
uniform float u_time;

varying vec2 vUv;
varying vec3 vPosition;


float randc(vec2 co){ // some kind of  (-0.5, +0,5) / 2.5 rand
	return ((fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) - 0.5)) / 2.0;
}

vec3 randomizeColor (vec3 color) {
  color = clamp(color, 0.0, 1.0);
	color.r = color.r - randc(vPosition.xy + sin(u_time));
	color.g = color.g - randc(vPosition.xy + sin(u_time * 5.2));
	color.b = color.b - randc(vPosition.xy + sin(u_time * 1.4));
	return color;
}

#define OCTAVES 3
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * cnoise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}


vec3 hash3(vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
  dot(p, vec2(269.5, 183.3)),
  dot(p, vec2(419.2, 371.9)) );
  return fract(sin(q) * 43758.5453);
}
float voronoise(in vec2 p, float u, float v) {
  float k = 1.0 + 63.0 * pow(1.0 - v, 6.0);
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 a = vec2(0.0, 0.0);
  for(int y = -2; y <= 2; y++) {
    for(int x = -2; x <= 2; x++) {
      vec2  g = vec2(x, y);
      vec3  o = hash3(i + g) * vec3(u, u, 1.0);
      vec2  d = g - f + o.xy;
      float w = pow(1.0 - smoothstep(0.0, 1.414, length(d)), k);
      a += vec2(o.z * w, w);
    }
  }
  return a.x / a.y;
}

void main (void) {
  vec2 position = vPosition.xy;
  float n1 = cnoise(position * 4.0) - 0.1;
  n1 = clamp(n1 * 3.5, 0.0, 1.0);
  vec3 color1 = vec3(0.95, 0.41, 0.22) * n1;

  position = position + 10.0;
  float n2 = cnoise(position * 10.0) - 0.1;
  n2 = clamp(n2 * 3.5, 0.0, 1.0);
  vec3 color2 = vec3(0.5, 0.99, 0.56) * n2;

  position = position + 10.0;
  float n3 = cnoise(position * 5.0) - 0.1;
  n3 = clamp(n3 * 3.5, 0.0, 1.0);
  vec3 color3 = vec3(0.5, 0.59, 0.96) * n3;

  vec3 color = vec3(1.0) - (color1 - color2 + color3) - color1 * color2 - color3;
  color = vec3(1.0) - color;
  gl_FragColor = vec4(randomizeColor(color), 1.0);
}