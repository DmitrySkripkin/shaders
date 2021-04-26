console.log('Hello there!');
const SIZE = 4;
const RESOLUTION = 500;
window.resources = {};
const loadFile = async (file, key) => { // Load external files as strings
  const response = await fetch(file);
  const text = await response.text();
  resources[key || file.split('/').pop()] = text;
}

const initScene = () => { // Init ThreeJS scene
  const scene = new THREE.Scene();
  window.scene = scene;
  const camera = new THREE.PerspectiveCamera( -1, 1, 1, -1, 0.1, 10 );
  camera.position.z = 100;
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xff0000, 0);
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  const clock = new THREE.Clock();
  // const geometry = new THREE.BoxGeometry( SIZE, SIZE, SIZE, 1, RESOLUTION, 1 );
  const geometry = new THREE.PlaneGeometry( SIZE, SIZE, RESOLUTION, RESOLUTION );
  const uniforms = {
    u_time: { value: 0.0 }
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: resources['empty.vert'],
    fragmentShader: resources['noisemix.frag'],
    // wireframe: true
  });

  const plane = new THREE.Mesh( geometry, material );
  window.plane = plane;
  scene.add( plane );

  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );

  animate();

  function onWindowResize(event) {
    const aspectRatio = window.innerWidth / window.innerHeight;
    let width, height;
    if (aspectRatio >= 1 ) {
      width = 1;
      height = (window.innerHeight / window.innerWidth) * width;
    } else {
      width = aspectRatio;
      height = 1;
    }
    camera.left = -width;
    camera.right = width;
    camera.top = height;
    camera.bottom = -height;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    uniforms.u_time.value += clock.getDelta();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
};

const initResources = async () => { // Load all resources
  await loadFile('./shaders/empty.vert');
  await loadFile('./shaders/noisemix.frag');
};


const init = async () => {
  await initResources();
  initScene();
};

init();

window.export = (mesh) => {
  plane.scale.y = plane.scale.z = plane.scale.x = 0.1;
  for (let v of plane.geometry.vertices) {
      // v.x = v.x + (noise.perlin3(v.x, v.y, v.z) / 3.0);
      // v.y = v.y + (noise.perlin3(v.x, v.y, v.z) / 3.0);
      if (v.z > 1) v.z = noise.perlin3(v.x * 2, v.y * 2, v.z * 2) / 3.0;
  }
  plane.geometry.verticesNeedUpdate = true;
  const bufferMesh = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(mesh.geometry));
  window.scene.add(bufferMesh);
  const exporter = new THREE.STLExporter();
  return exporter.parse( bufferMesh, { binary: false } )
}