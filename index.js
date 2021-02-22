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
  const camera = new THREE.PerspectiveCamera( -1, 1, 1, -1, 0.1, 10 );
  camera.position.z = 100;
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xff0000, 0);
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  const clock = new THREE.Clock();
  const geometry = new THREE.PlaneBufferGeometry( SIZE, SIZE, RESOLUTION, RESOLUTION );

  const uniforms = {
    u_time: { value: 0.0 }
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: resources['empty.vert'],
    fragmentShader: resources['circle.frag'],
  });

  const plane = new THREE.Mesh( geometry, material );
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
  await loadFile('./shaders/circle.frag');
};


const init = async () => {
  await initResources();
  initScene();
};

init();