import * as THREE from 'three'

const drawGoldCube = (scene) => {

  var cube;
  var cubeSizeLength = 100;
  var goldColor = "#FFDF00";
  var showFrame = true;
  var wireMaterial = new THREE.MeshBasicMaterial( { color: goldColor, wireframe: showFrame } ) ;

  var cubeGeometry = new THREE.CubeGeometry(cubeSizeLength, cubeSizeLength, cubeSizeLength);

  cube = new THREE.Mesh( cubeGeometry, wireMaterial );
  cube.position.x = 0;	// centered at origin
  cube.position.y = 0;	// centered at origin
  cube.position.z = 0;	// centered at origin
  scene.add( cube );
}

export default drawGoldCube