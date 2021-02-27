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


vec3 hash3( vec2 p ) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
           dot(p,vec2(269.5,183.3)), 
           dot(p,vec2(419.2,371.9)) );
  return fract(sin(q)*43758.5453);
}
float voronoise( in vec2 p, float u, float v ) {
  float k = 1.0+63.0*pow(1.0-v,6.0);

    vec2 i = floor(p);
    vec2 f = fract(p);
    
  vec2 a = vec2(0.0,0.0);
    for( int y=-2; y<=2; y++ )
    for( int x=-2; x<=2; x++ )
    {
        vec2  g = vec2( x, y );
    vec3  o = hash3( i + g )*vec3(u,u,1.0);
    vec2  d = g - f + o.xy;
    float w = pow( 1.0-smoothstep(0.0,1.414,length(d)), k );
    a += vec2(o.z*w,w);
    }
  
    return a.x/a.y;
}

void main (void) {
  vec2 position = vPosition.xy + (u_time / 10.0);
  float n = fbm(position);
  float n1 = fbm(position * 2.0) * 2.0;;
  float n2 = voronoise(position * 5.0, 1.2, 1.7);
  float n4 = fbm(position * 10.0) * 0.4;
  vec3 color1 = vec3(0.34, 0.54, 0.57) * 2.0;
  // vec3 color = randomizeColor(color1 + (n));
  vec3 color = randomizeColor(color1 + (n + n1 + n4 + n2));
  gl_FragColor = vec4(color, 1.0);
}