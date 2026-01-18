import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const gui = new GUI();

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 3);


// Particles
const parameters = {
  count: 1000,
  size: 0.02
};

let particleGeometry = null;
let particleMaterial = null;
let points = null;


const galaxyGenerator = () => {
  if(points !== null){
    particleGeometry.dispose();
    particleMaterial.dispose();
    scene.remove(points)
  }

  particleGeometry = new THREE.BufferGeometry();
  const particles = new Float32Array(parameters.count * 3);

for(let i =0; i< parameters.count; i++){
  const i3 = i * 3;

  particles[i3 + 0] = (Math.random() - 0.5) * 3;
  particles[i3 + 1] = (Math.random() - 0.5) * 3;
  particles[i3 + 2] = (Math.random() - 0.5) * 3;

}

particleGeometry.setAttribute("position", new THREE.BufferAttribute(particles, 3));

particleMaterial = new THREE.PointsMaterial({
  size: parameters.size,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

points = new THREE.Points(particleGeometry, particleMaterial);
scene.add(points);
}

galaxyGenerator();


// Lil-gui
gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(galaxyGenerator)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(galaxyGenerator)


// Renderer
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// Resize Handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();