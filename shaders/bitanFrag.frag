uniform vec3 u_color;
varying vec3 displacedNormal;
varying vec3 height;
varying float n;
vec3 hsv2rgb(vec3 hsv) {
  float h = hsv.x;
  float s = hsv.y;
  float v = hsv.z;
  vec4 k = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(vec3(h)+k.xyz)*6.0-k.www);
  return v*mix(k.xxx, clamp(p-k.xxx, 0.0, 1.0), s);
}
void main () {
  vec3 viewPos = vec3(10.0, 10.0, 10.0);
  float hueRange = 0.3;
  float hueAverage = 0.5;
  
  float hue = (1.0 - pow(dot(displacedNormal, (viewPos)), 1.0)) * hueRange + hueAverage;
  vec3 hsvColor = vec3(hue, n * 2.5, n);
  vec3 rgbColor = hsv2rgb(hsvColor);
  // vec3 rgbColor = vec3(1.0) * n;
  gl_FragColor = vec4(vec3(0.9) - rgbColor, 1.0);
}