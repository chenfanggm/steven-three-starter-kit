import * as THREE from 'three'
import _ from 'lodash'

const getPolygonGeometry = (sides, radius = 1, location = new THREE.Vector3(0,0,0)) => {

  const geometry = new THREE.Geometry()

  // generate vertices
  for (let point = 0; point < sides; point++) {
    // Add 90 degrees so we start at +Y axis, rotate counterclockwise around
    const angle = (Math.PI/2) + (point / sides) * 2 * Math.PI;
    const x = Math.cos( angle ) * radius + location.x;
    const y = Math.sin( angle ) * radius + location.y;
    const z = location.z;


    geometry.vertices.push(new THREE.Vector3(x, y, z))
  }

  // Write the code to generate minimum number of faces for the polygon.
  for (let vert = 0; vert < sides-2; vert++) {
    geometry.faces.push(new THREE.Face3(0, vert + 1, vert + 2))
  }

  return geometry
}

export default getPolygonGeometry