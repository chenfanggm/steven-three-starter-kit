import * as THREE from 'three'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth/2, window.innerHeight/2)
renderer.setClearColor(0x0499ff)
document.getElementById('mainCanvas').appendChild(renderer.domElement)

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

render()