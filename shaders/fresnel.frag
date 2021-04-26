vec3 u_color = vec3(0.4, 0.8, 0.5);
vec3 u_light_position = vec3(1.0, 2.0, 2.0);
vec3 u_sun_color = vec3(1.0, 1.0, 1.0);
float u_sun_strength = 0.5;

vec3 u_rim_color = vec3(1.0, 1.0, 1.0);
float u_rim_strength = 1.6;
float u_rim_width = 0.6;

// Example varyings passed from the vertex shader
varying vec3 vPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;
varying mat4 vModelMatrix;

void main()
{
	vec3 worldPosition = ( vModelMatrix * vec4( vPosition, 1.0 )).xyz;

	vec3 lightVector = normalize( u_light_position - worldPosition );
	vec3 viewVector = normalize(cameraPosition - worldPosition);

	float rimndotv =  max(0.0, u_rim_width - clamp(dot(vWorldNormal, viewVector), 0.0, 1.0));

	vec3 rimLight = rimndotv * u_rim_color * u_rim_strength;

	float ndotl = max(0.0, dot(vWorldNormal, lightVector));
	vec3 sunLight = u_sun_color * u_sun_strength * ndotl;

	vec3 finalLight = rimLight + sunLight;

	gl_FragColor = vec4( u_color * finalLight, 1.0 );

}