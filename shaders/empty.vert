#include <noise>
uniform float u_time;
varying vec3 vPosition;
void main () {
	vPosition = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);
}