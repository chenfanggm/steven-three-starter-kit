import * as THREE from 'three'
import config from '../config'
import './styles/main.scss'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth/2, window.innerHeight/2)
renderer.setClearColor(0x3399ff)
document.getElementById('mainCanvas').appendChild(renderer.domElement)

var geometry = new THREE.BoxGeometry(5, 5, 5);
var loader = new THREE.TextureLoader();
var material = new THREE.MeshLambertMaterial({color: 0xf6546a})
var mesh = new THREE.Mesh(geometry, material)

// URL of texture
loader.load("./static/images/box_texture.jpg", function(texture){
  var material = new THREE.MeshLambertMaterial({map: texture});
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});

var light = new THREE.PointLight(0xffffff, 1.2);

light.position.set(0, 0, 6);
scene.add(light);

camera.position.z = 10;

const render = () => {
  requestAnimationFrame(render);
  mesh.rotation.x += 0.1;
  mesh.rotation.y += 0.1;
  renderer.render(scene, camera);
}

if (config.env === 'development') {
  if (module.hot) {
    module.hot.accept()
  }
}

render()