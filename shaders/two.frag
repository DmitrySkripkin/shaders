#include <noise>

uniform float u_time;
varying vec3 displacedNormal;
varying vec3 vPosition;
varying float n;
#define NUM_OCTAVES 5
vec3 hsv2rgb(vec3 hsv) {
  float h = hsv.x;
  float s = hsv.y;
  float v = hsv.z;
  vec4 k = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(vec3(h)+k.xyz)*6.0-k.www);
  return v*mix(k.xxx, clamp(p-k.xxx, 0.0, 1.0), s);
}
float circle(vec2 pt, vec2 center, float radius, float edge_thickness){
  vec2 p = pt - center;
  float len = length(p);
  float result = 1.0 - smoothstep(radius - edge_thickness, radius, len);
  return result;
}


float invertedCircle(vec2 pt, vec2 center, float radius, float edge_thickness){
  vec2 p = pt - center;
  float len = length(p);
  float result = 1.0 - smoothstep(edge_thickness, radius, len);
  return result;
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

void main () {
  vec3 lightColor = vec3(1.1, 0.9, 1.8);
  vec3 darkColor = vec3(0.9, 0.4, 0.8);
  vec3 viewPos = vec3(1.0, 1.0, 1.0);

  vec2 st = vPosition.xy; /// (80.0 * length(position.y + 1.0));
  vec2 q = vec2(0.);
  q.x = fbm(st);
  q.y = fbm(st + vec2(1.0));
  float f = fbm(st + q + u_time + length((vPosition.xy + 0.15)) * (u_time / 3.0)) + length(vPosition.xy * 5.0);
  float lerp = pow(n, 2.0) * (n*n*n);
  vec3 color = mix(darkColor, lightColor, lerp);
  
  float hue = (1.0 - pow(dot(displacedNormal, viewPos), 1.0));
  vec3 hsvColor = vec3(hue, 0.0, 0.9);
  vec3 rgbColor = hsv2rgb(hsvColor);
  color = color * (circle(vPosition.xy, vec2(0.0), 0.45, 0.2)) + (invertedCircle(vPosition.xy, vec2(0.0), 0.45, 0.49));
  gl_FragColor = vec4(1.1 - randomizeColor(color, 2.5), 1.0);
}




