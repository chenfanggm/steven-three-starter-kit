'use strict'
import * as THREE from 'three'
import dat from 'dat-gui'
import _ from 'lodash'
import $ from 'jquery'
import './lib/OrbitAndPanControls.new'
import _Coordinates from './lib/Coordinates'
import config from '../config'
import './styles/main.scss'
import drawGoldCube from './components/drawGoldCube'
import getBigBall from './components/getBigBall'
import getSmallBall from './components/getSmallBall'
import getPolygonGeometry from './components/getPolygonGeometry'


// object collection
let MODEL_POOL = {}
// global params
const MAIN = {}
MAIN.SCENE = new THREE.Scene()
MAIN.CANVAS_DOM_ID = 'mainCanvas'
MAIN.CANVAS_WIDTH = window.innerWidth/1.5
MAIN.CANVAS_HEIGHT = window.innerHeight/1.5
MAIN.CANVAS_BG_COLOR= 0xDDDDDD
MAIN.CAMERA_FOV = 45
MAIN.CAMERA_ASPECT = MAIN.CANVAS_WIDTH/MAIN.CANVAS_HEIGHT
MAIN.CAMERA_NEAR = 0.1
MAIN.CAMERA_FAR = 4000
MAIN.DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;
MAIN.COORDINATES = {
  gridX: true,
  gridY: true,
  gridZ: true,
  axes: true,
  ground: false
}

// init
const camera = new THREE.PerspectiveCamera(
  MAIN.CAMERA_FOV, MAIN.CAMERA_ASPECT, MAIN.CAMERA_NEAR, MAIN.CAMERA_FAR)
const renderer = new THREE.WebGLRenderer({ antialias: true })
const cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement)
const textureLoader = new THREE.TextureLoader()
const canvasDom = document.getElementById(MAIN.CANVAS_DOM_ID)
const clock = new THREE.Clock()

const init = () => {
  // renderer
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.setSize(MAIN.CANVAS_WIDTH, MAIN.CANVAS_HEIGHT)
  renderer.setClearColor(MAIN.CANVAS_BG_COLOR, 1)

  // canvas DOM
  canvasDom.appendChild(renderer.domElement)

  // camera
  camera.position.set(50,50,50)
  // camera control
  cameraControls.target.set(0,0,0);
}

const fillScene = () => {
  // MAIN.SCENE
  MAIN.SCENE = new THREE.Scene()
  MAIN.SCENE.fog = new THREE.Fog(0x808080, 2000, 4000)

  // model
  MODEL_POOL.smallBall = getSmallBall()
  MODEL_POOL.bigBall = getBigBall()

  _.forEach(MODEL_POOL, (value) => {
    MAIN.SCENE.add(value)
  })

  // light
  //const light = new THREE.PointLight(0xFFFFFF, 1.2)
  const ambientLight = new THREE.AmbientLight(0xFFFFFF)
  ambientLight.position.set(100, 100, 100)
  MAIN.SCENE.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
  directionalLight.position.set(100, 100, 100 )
  directionalLight.target = MODEL_POOL.smallBall
  MAIN.SCENE.add(directionalLight)

  // show grids
  const Coordinates = _Coordinates(MAIN.SCENE)
  if (MAIN.COORDINATES.ground) {
    Coordinates.drawGround({size:200});
  }
  if (MAIN.COORDINATES.gridX) {
    Coordinates.drawGrid({size:100, scale:0.1});
  }
  if (MAIN.COORDINATES.gridY) {
    Coordinates.drawGrid({size:100, scale:0.1, orientation:"y"});
  }
  if (MAIN.COORDINATES.gridZ) {
    Coordinates.drawGrid({size:100, scale:0.1, orientation:"z"});
  }
  if (MAIN.COORDINATES.axes) {
    Coordinates.drawAllAxes({axisLength:25, axisRadius:1, axisTess:50});
  }
}

const setupGUI = () => {
  MAIN.GUI = {
    newGridX: MAIN.COORDINATES.gridX,
    newGridY: MAIN.COORDINATES.gridY,
    newGridZ: MAIN.COORDINATES.gridZ,
    newGround: MAIN.COORDINATES.ground,
    newAxes: MAIN.COORDINATES.axes
  }
  const gui = new dat.GUI();
  const h = gui.addFolder("Grid display");
  h.add( MAIN.GUI, "newGridX").name("Show XZ grid");
  h.add( MAIN.GUI, "newGridY" ).name("Show YZ grid");
  h.add( MAIN.GUI, "newGridZ" ).name("Show XY grid");
  h.add( MAIN.GUI, "newGround" ).name("Show ground");
  h.add( MAIN.GUI, "newAxes" ).name("Show axes");
}

const animate = () => {
  MAIN.RUNNING_LOOP = window.requestAnimationFrame(animate)
  render()
}

const render = () => {
  const delta = clock.getDelta();
  cameraControls.update(delta);

  if ( MAIN.GUI.newGridX !== MAIN.COORDINATES.gridX ||
    MAIN.GUI.newGridY !== MAIN.COORDINATES.gridY ||
    MAIN.GUI.newGridZ !== MAIN.COORDINATES.gridZ ||
    MAIN.GUI.newGround !== MAIN.COORDINATES.ground ||
    MAIN.GUI.newAxes !== MAIN.COORDINATES.axes) {

    MAIN.COORDINATES.gridX = MAIN.GUI.newGridX
    MAIN.COORDINATES.gridY = MAIN.GUI.newGridY
    MAIN.COORDINATES.gridZ = MAIN.GUI.newGridZ
    MAIN.COORDINATES.ground = MAIN.GUI.newGround
    MAIN.COORDINATES.axes = MAIN.GUI.newAxes

    fillScene()
  }

  renderer.render(MAIN.SCENE, camera)
}

const reload = () => {
  // clean animation
  if (MAIN.RUNNING_LOOP) {
    cancelAnimationFrame(MAIN.RUNNING_LOOP)
  }
  // clean scene
  if (MAIN.SCENE.children) {
    MAIN.SCENE.children.map((obj) => {
      MAIN.SCENE.remove(obj)
    })
  }
  if (Object.keys(MODEL_POOL)) {
    Object.keys(MODEL_POOL).map((key) => {
      MAIN.SCENE.remove(MODEL_POOL[key])
    })
  }
  // clean model pool
  MODEL_POOL = {}
  // clean GUI
  $('.dg.ac').empty()
  // clean canvas
  if (canvasDom.childNodes[0]) {
    canvasDom.removeChild(canvasDom.childNodes[0])
  }

  // refresh process
  init()
  setupGUI()
  fillScene()
  MAIN.RUNNING_LOOP = animate()
  console.log('Reload complete.')
}

// Hot module replace setting
if (config.env === 'development') {
  if (module.hot) {
    module.hot.accept()
  }
}

/**
 * Start Main Process
 */
reload()


