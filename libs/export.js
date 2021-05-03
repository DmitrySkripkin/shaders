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

function randomIntStringFromInterval(min, max) { // min and max included 
  return (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * (max - min + 1) + min);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}