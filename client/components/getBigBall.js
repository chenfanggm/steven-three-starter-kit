import * as THREE from 'three'

const getBigBall = () => {
  const material = new THREE.MeshPhongMaterial({
    color: 0x80FC66,
    specular: 0xFFFFFF,
    shininess: 100,
    opacity: 0.5,
    transparent: true }
  );

  return new THREE.Mesh( new THREE.SphereGeometry( 15, 16, 16 ), material );
}

export default getBigBall