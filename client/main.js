import * as THREE from 'three'
import config from '../config'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth/4, window.innerHeight/2)
renderer.setClearColor(0x0499ff)
document.getElementById('mainCanvas').appendChild(renderer.domElement)

const render = () => {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

if (config.env === 'development') {
  if (module.hot) {
    module.hot.accept()
  }
}

render()