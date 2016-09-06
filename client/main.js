import * as THREE from 'three'
import config from '../config'
import './styles/main.scss'

// object collection
const MODEL_POOL = {}
// global params
const MAIN = {}
MAIN.CANVAS_DOM_ID = 'mainCanvas'
MAIN.CANVAS_WIDTH = window.innerWidth/1.5
MAIN.CANVAS_HEIGHT = window.innerHeight/1.5
MAIN.CAMERA_FOV = 75
MAIN.CAMERA_ASPECT = window.innerWidth/window.innerHeight
MAIN.CAMERA_NEAR = 0.1
MAIN.CAMERA_FAR = 1000




const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  MAIN.CAMERA_FOV, MAIN.CAMERA_ASPECT, MAIN.CAMERA_NEAR, MAIN.CAMERA_FAR)
const renderer = new THREE.WebGLRenderer()
const textureLoader = new THREE.TextureLoader()
const canvasDom = document.getElementById(MAIN.CANVAS_DOM_ID)

const initialize = () => {
  // camera
  camera.position.z = 10
  // renderer
  renderer.setSize(MAIN.CANVAS_WIDTH, MAIN.CANVAS_HEIGHT)
  renderer.setClearColor(0x3399FF)
  // model
  const geometry = new THREE.BoxGeometry(5, 5, 5)
  const material = new THREE.MeshLambertMaterial({color: 0xF6546A})
  MODEL_POOL.box = new THREE.Mesh(geometry, material)
  // texture
  textureLoader.load("./static/images/box_texture.jpg", (texture) => {
    const material = new THREE.MeshLambertMaterial({map: texture})
    MODEL_POOL.box = new THREE.Mesh(geometry, material)
    scene.add(MODEL_POOL.box)
  })
  // light
  const light = new THREE.PointLight(0xFFFFFF, 1.2)
  light.position.set(0, 0, 5)
  scene.add(light)
  // canvas DOM
  canvasDom.appendChild(renderer.domElement)
}

const render = () => {
  MODEL_POOL.box.rotation.x += 0.1
  MODEL_POOL.box.rotation.y += 0.1
  renderer.render(scene, camera)
}

const animate = () => {
  MAIN.RUNNING_LOOP = requestAnimationFrame(animate)
  render()
}

const reload = () => {
  console.log('Canceling the running loop...')
  if (MAIN.RUNNING_LOOP) {
    cancelAnimationFrame(MAIN.RUNNING_LOOP)
  }

  console.log('Removing all children...')
  if (scene.children) {
    scene.children.map((obj) => {
      scene.remove(obj)
    })
  }

  if (Object.keys(MODEL_POOL)) {
    Object.keys(MODEL_POOL).map((key) => {
      scene.remove(MODEL_POOL[key])
    })
  }

  if (canvasDom.childNodes[0]) {
    canvasDom.removeChild(canvasDom.childNodes[0])
  }

  initialize()
  MAIN.RUNNING_LOOP = animate()
  console.log('Reload complete.')
}

reload()

// Hot module replace setting
if (config.env === 'development') {
  if (module.hot) {
    module.hot.accept()
  }
}
