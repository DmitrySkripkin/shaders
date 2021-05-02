#include <noise>
uniform float u_time;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying mat4 vModelMatrix;
varying vec3 vWorldNormal;
void main () {
	vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
	vUv = uv;
	vec3 _pos = position;
	_pos.z = _pos.z + (cnoise(_pos.xy * 1.5 + u_time) * 1.0);
	vPosition = position;
	vNormal = normal;
	vModelMatrix = modelMatrix;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);
}