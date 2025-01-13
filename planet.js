// Import THREE.js and OrbitControls
import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 15;

const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

// Add materials for orbits and planets
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Create ring geometries for orbits
const orbits = [];
const ringRadii = [3, 5, 7, 9, 11, 13, 15, 17];
ringRadii.forEach(radius => {
  const ringGeometry = new THREE.RingGeometry(radius, radius + 0.1, 32);
  const ringMesh = new THREE.Mesh(ringGeometry, material);
  orbits.push(ringMesh);
  scene.add(ringMesh);
});

// Planet textures and descriptions
const planets = [
    { name: "Matahari", texture: "textures/sun.jpeg", desc: "Matahari adalah bola plasma yang terdiri dari gas panas terutama hidrogen dan helium.", position: [0, 0, 0] },
    { name: "Merkurius", texture: "textures/mercury.jpeg", desc: "Planet terkecil di tata surya.", position: [-1, -3, 0] },
    { name: "Venus", texture: "textures/venus.jpeg", desc: "Planet terpanas dengan atmosfer tebal.", position: [5, -1, 0] },
    { name: "Bumi", texture: "textures/earth.jpeg", desc: "Planet kita yang penuh dengan kehidupan.", position: [1, 7, 0] },
    { name: "Mars", texture: "textures/mars.jpeg", desc: "Planet merah dengan lanskap berdebu.", position: [-9, 1, 0] },
    { name: "Jupiter", texture: "textures/jupyter.jpeg", desc: "Planet terbesar dengan Bintik Merah Besar yang terkenal.", position: [11, 3, 0] },
    { name: "Saturnus", texture: "textures/saturn.jpeg", desc: "Terkenal dengan sistem cincin yang indah.", position: [-4, -12, 0] },
    { name: "Uranus", texture: "textures/uranus.jpeg", desc: "Planet yang berputar di sisinya.", position: [-7, 13, 0] },
    { name: "Neptunus", texture: "textures/neptune.jpeg", desc: "Planet terjauh dengan warna biru tua.", position: [7, -15.5, 0] },
  ];

const planetMeshes = [];
planets.forEach((planet, index) => {
  const texture = new THREE.TextureLoader().load(planet.texture);
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const planetMesh = new THREE.Mesh(sphereGeometry, material);
  planetMesh.position.set(...planet.position);
  planetMeshes.push({ mesh: planetMesh, name: planet.name, desc: planet.desc });
  scene.add(planetMesh);
});

// Add Saturn's rings
const saturnRingTexture = new THREE.TextureLoader().load("textures/saturnRing.jpeg");
const saturnRingGeometry = new THREE.RingGeometry(1.5, 2, 32);
const saturnRingMaterial = new THREE.MeshBasicMaterial({ map: saturnRingTexture, side: THREE.DoubleSide });
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.position.set(-4, -12, 0);
saturnRing.rotation.x = Math.PI / 2;
saturnRing.rotation.y = Math.PI / 4;
scene.add(saturnRing);

function createPopup(name, desc) {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.left = `3000px`;
  popup.style.top = `1000px`;
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.color = 'white';
  popup.style.padding = '20px';
  popup.style.borderRadius = '10px';
  popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  popup.style.textAlign = 'center';
  popup.style.fontSize = '80px';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.5s ease-in-out';

  const title = document.createElement('h2');
  title.textContent = name;
  const description = document.createElement('p');
  description.textContent = desc;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '10px';
  closeButton.style.padding = '10px 20px';
  closeButton.style.border = 'none';
  closeButton.style.backgroundColor = '#ff5722';
  closeButton.style.color = 'white';
  closeButton.style.borderRadius = '5px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '50px';

  closeButton.addEventListener('click', () => {
    popup.style.opacity = '0';
    setTimeout(() => document.body.removeChild(popup), 500);
  });

  popup.appendChild(title);
  popup.appendChild(description);
  popup.appendChild(closeButton);

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = '1';
  }, 10);
}

function handleKeyPress(event) {
  const key = event.key;
  if (key >= '0' && key <= '9') {
    const planetIndex = parseInt(key) - 1;
    if (planetIndex < planetMeshes.length) {
      const planet = planetMeshes[planetIndex];
      const vector = new THREE.Vector3(...planet.mesh.position.toArray());
      vector.project(camera);
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
      createPopup(planet.name, planet.desc, { x, y });
    }
  }
}

document.addEventListener('keypress', handleKeyPress);

function animate() {
  planetMeshes.forEach(planet => {
    planet.mesh.rotation.y += 0.01;
  });
  saturnRing.rotation.z += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
