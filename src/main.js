import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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


const galaxyGenerator = () => {
  const particleGeometery = new THREE.BufferGeometry();
const particles = new Float32Array(parameters.count * 3);

for(let i =0; i< parameters.count; i++){
  const i3 = i * 3;

  particles[i3 + 0] = (Math.random() - 0.5) * 3;
  particles[i3 + 1] = (Math.random() - 0.5) * 3;
  particles[i3 + 2] = (Math.random() - 0.5) * 3;

}

particleGeometery.setAttribute("position", new THREE.BufferAttribute(particles, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: parameters.size,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const points = new THREE.Points(particleGeometery, particleMaterial);
scene.add(points);
}

galaxyGenerator();


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