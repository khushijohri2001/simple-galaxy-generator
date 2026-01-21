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
camera.position.set(0, 0, 6);


// Particles
const parameters = {
  count: 50000,
  size: 0.001,
  radius: 5,
  branches: 7,
  spin: 1,
  randomness: 0.5,
  randomnessPower: 3.5,
  insideColor: '#ff6030',
  outsideColor: '#1b3984'
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
  const colors = new Float32Array(parameters.count * 3);

   const colorInside = new THREE.Color(parameters.insideColor)
   const colorOutside = new THREE.Color(parameters.outsideColor)

  for(let i = 0; i < parameters.count; i++){
  const i3 = i * 3;

  const particleOnRadius = Math.random() * parameters.radius; // between [0, radius]
  const spinAngle = particleOnRadius * parameters.spin;
  const branchAngle = (i % parameters.branches) /parameters.branches * Math.PI * 2;

  const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * particleOnRadius;
  const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * particleOnRadius;
  const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * particleOnRadius;

  // Position xyz
  particles[i3 + 0] = Math.cos(branchAngle + spinAngle) * particleOnRadius + randomX;
  particles[i3 + 1] = randomY;
  particles[i3 + 2] = Math.sin(branchAngle + spinAngle) * particleOnRadius + randomZ;

  const mixedColor = colorInside.clone();
  mixedColor.lerp(colorOutside, particleOnRadius / parameters.radius);

  // Colors rgb
  colors[i3 + 0] = mixedColor.r
  colors[i3 + 1] = mixedColor.g
  colors[i3 + 2] = mixedColor.b

}

particleGeometry.setAttribute("position", new THREE.BufferAttribute(particles, 3));
particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

particleMaterial = new THREE.PointsMaterial({
  size: parameters.size,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true
});



points = new THREE.Points(particleGeometry, particleMaterial);
scene.add(points);

points.rotation.x = 0.5;
points.rotation.z = 0.3;
}

galaxyGenerator();




// Lil-gui
gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(galaxyGenerator)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(galaxyGenerator)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(galaxyGenerator)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'randomnessPower').min(0).max(8).step(0.001).onFinishChange(galaxyGenerator)
gui.addColor(parameters, 'insideColor').onFinishChange(galaxyGenerator)
gui.addColor(parameters, 'outsideColor').onFinishChange(galaxyGenerator)

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

const clock = new THREE.Clock();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  points.rotation.y = clock.getElapsedTime() * 0.02;
  controls.update();
  renderer.render(scene, camera);
}
animate();