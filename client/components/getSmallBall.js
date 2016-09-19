import * as THREE from 'three'

const getSmallBall = () => {

  const geometry = new THREE.Geometry()

  geometry.vertices.push(new THREE.Vector3(0,0,0))
  geometry.vertices.push(new THREE.Vector3(1,0,0))
  geometry.vertices.push(new THREE.Vector3(0,2,0))

  geometry.faces.push(new THREE.Face3(0,1,2))

  const color1 = new THREE.Color(0xff0000)
  const color2 = new THREE.Color(0x00ff00)
  const color3 = new THREE.Color(0x0000ff)
  geometry.faces[0].vertexColors = [color1, color2, color3]

  const material = new THREE.MeshLambertMaterial( { color: 0xB3B3B3, transparent: false } );
  const ka = 0.4;
  material.color.setRGB(material.color.r * ka, material.color.g * ka, material.color.b * ka);
  const sphere = new THREE.Mesh( new THREE.SphereGeometry( 10, 16, 16 ), material );

  return sphere
}

export default getSmallBall