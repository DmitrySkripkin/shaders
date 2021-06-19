#include <noise>
uniform float u_time;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying mat4 vModelMatrix;
varying vec3 vWorldNormal;


#define NUM_OCTAVES 3
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
	vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
	vUv = uv;
	vec3 _pos = position;
	_pos.z = _pos.z * fbm(_pos.xy * 1.5 + u_time);
	// _pos.z = _pos.z + (cnoise(_pos.xy * 1.5 + u_time) * 1.0);
	vPosition = position;
	vNormal = normal;
	vModelMatrix = modelMatrix;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);
}