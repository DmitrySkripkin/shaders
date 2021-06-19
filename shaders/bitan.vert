#include <noise>
varying vec2 vUv;
varying vec3 displacedNormal;
varying vec3 vPosition;
varying vec3 height;
varying float n;
uniform float u_time;

void main () {
  vPosition = position;
  float mp = 0.8;
  vec2 st = position.xy;
  // Scale the coordinate system to see
  // some noise in action
  vec3 pos = vec3(st, 1.0);
  float time = u_time / 4.0;
  pos.y -= time + sin(time);
  pos.x -= time  + cos(time);
  // Use the noise function
  n = cnoise(pos) * mp;
  vec3 displaced = position + normal * n;
  float offset = 1.0;
  vec3 neighbour1 = position + vec3(offset, 0, 0);
  vec3 neighbour2 = position + vec3(0, offset, 0);
  vec3 displacedNeighbour1 = neighbour1 + normal * cnoise(vec3(neighbour1.xy, 1.0));
  vec3 displacedNeighbour2 = neighbour2 + normal * cnoise(vec3(neighbour2.xy, 1.0));
  vec3 tangent = displacedNeighbour1 - displaced;
  vec3 bitangent = displacedNeighbour2 - displaced;
  displacedNormal = normalize(cross(tangent, bitangent));
  height = vec3(0.0, 0.0, position.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z + n, 1.0);
}