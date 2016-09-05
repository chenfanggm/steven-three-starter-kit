import * as THREE from 'three'
import config from '../config'
import './styles/main.scss'

const MODEL_POOL = {}
const MAIN = {}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const loader = new THREE.TextureLoader()
const mainCanvas = document.getElementById('mainCanvas')
/**
 * Init Renderer
 */
const initRenderer = () => {
  // renderer
  renderer.setSize(window.innerWidth/1.5, window.innerHeight/1.5)
  renderer.setClearColor(0x3399ff)

  // model
  const geometry = new THREE.BoxGeometry(5, 5, 5)
  const material = new THREE.MeshLambertMaterial({color: 0xf6546a})
  MODEL_POOL.box = new THREE.Mesh(geometry, material)

  // texture
  loader.load("./static/images/box_texture.jpg", (texture) => {
    const material = new THREE.MeshLambertMaterial({map: texture})
    MODEL_POOL.box = new THREE.Mesh(geometry, material)
    scene.add(MODEL_POOL.box)
  })

  // light
  const light = new THREE.PointLight(0xffffff, 1.2)
  light.position.set(0, 0, 6)
  scene.add(light)

  // camera
  camera.position.z = 10

  mainCanvas.appendChild(renderer.domElement)
}

const renderLoop = () => {
  MODEL_POOL.box.rotation.x += 0.1
  MODEL_POOL.box.rotation.y += 0.1
  renderer.render(scene, camera)
  MAIN.runningLoop = requestAnimationFrame(renderLoop)
}

const reload = () => {
  console.log('Canceling the running loop...')
  if (MAIN.runningLoop) {
    cancelAnimationFrame(MAIN.runningLoop)
  }

  console.log('Removing all children...')
  scene.children.map((obj) => {
    scene.remove(obj)
  })

  if (mainCanvas.childNodes[0]) {
    mainCanvas.removeChild(mainCanvas.childNodes[0])
  }

  initRenderer()
  MAIN.runningLoop = renderLoop()
  console.log('Reload complete.')
}

reload()

/**
 * HMR
 */
if (config.env === 'development') {
  if (module.hot) {
    module.hot.accept()
  }
}
