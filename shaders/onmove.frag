#include <noise>
  uniform float u_time;
  varying vec2 vUv;
  varying vec3 vPosition;
  float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) / 7.0;
  }
  float circle(vec2 pt, vec2 center, float radius, float edge_thickness){
    vec2 p = pt - center;
    float len = length(p);
    float result = 1.0 - smoothstep(radius - edge_thickness, radius, len);
    return result;
  }
  float randc(vec2 co){ // some kind of  (-0.5, +0,5) / 2.5 rand
    return ((fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) - 0.5)) / 3.0;
  }
  vec3 randomizeColor (vec3 color) {
    color = clamp(color, 0.0, 1.0);
    color.r = color.r + randc(vPosition.xy + sin(u_time));
    color.g = color.g + randc(vPosition.xy + sin(u_time * 3.2));
    color.b = color.b + randc(vPosition.xy + sin(u_time * 1.4));
    return color;
  }

  void main () {    
    float noiseMult = 5.0;
    vec2 positionT = (vUv * noiseMult) - u_time;
    vec3 color = vec3(circle(vPosition.xy, vec2(0.0, 0.0), 0.35, 0.2), 0, 0);
    color.r = vec3(color.r +rand(positionT)).r;
    color.b = vec3(color.r - (cnoise(positionT) * 1.2)).r;
    color = color - (cnoise(positionT / 10.0));
    gl_FragColor = vec4(randomizeColor(color) + (rand(position) / 2.0), 1.0);
  }