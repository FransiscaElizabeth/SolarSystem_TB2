// Import THREE.js library dan OrbitControls untuk kontrol kamera
import * as THREE from "three"; 
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";

// Membuat scene utama untuk menyimpan semua objek 3D
const scene = new THREE.Scene();

// Membuat kamera perspektif dengan sudut pandang 45°, rasio layar, dan jarak pandang (near, far)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

// Membuat renderer untuk menggambar objek 3D di canvas HTML
const renderer = new THREE.WebGLRenderer();

// Mengatur ukuran renderer agar sesuai dengan ukuran jendela browser
renderer.setSize(window.innerWidth, window.innerHeight);

// Menambahkan elemen renderer (canvas) ke dalam dokumen HTML
document.body.appendChild(renderer.domElement);

// Mengatur posisi kamera di sumbu Z untuk melihat objek dari jarak tertentu
camera.position.z = 15;

// Menambahkan kontrol untuk kamera agar pengguna dapat memutar, memperbesar, dan memindahkan kamera
const controls = new OrbitControls(camera, renderer.domElement);

// Membuat cahaya Hemisphere untuk memberikan pencahayaan alami
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1); 
scene.add(light); // Menambahkan cahaya ke dalam scene

// Membuat material dasar untuk orbits dengan warna putih
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Membuat array untuk menyimpan ring (orbit planet)
const orbits = [];

// Array berisi radius setiap orbit
const ringRadii = [3, 5, 7, 9, 11, 13, 15, 17];

// Loop untuk membuat setiap ring orbit menggunakan radius dari array `ringRadii`
ringRadii.forEach(radius => {
  const ringGeometry = new THREE.RingGeometry(radius, radius + 0.1, 32); // Geometri ring (orbit)
  const ringMesh = new THREE.Mesh(ringGeometry, material); // Mesh untuk ring dengan material
  orbits.push(ringMesh); // Menyimpan ring ke dalam array
  scene.add(ringMesh); // Menambahkan ring ke dalam scene
});

// Data planet dengan nama, tekstur, deskripsi, dan posisi masing-masing
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

// Array untuk menyimpan mesh planet
const planetMeshes = [];

// Loop untuk membuat objek 3D setiap planet
planets.forEach((planet, index) => {
  const texture = new THREE.TextureLoader().load(planet.texture); // Memuat tekstur planet
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 16); // Geometri bola untuk planet
  const material = new THREE.MeshBasicMaterial({ map: texture }); // Material planet menggunakan tekstur
  const planetMesh = new THREE.Mesh(sphereGeometry, material); // Membuat mesh dari geometri dan material
  planetMesh.position.set(...planet.position); // Mengatur posisi planet
  planetMeshes.push({ mesh: planetMesh, name: planet.name, desc: planet.desc }); // Menyimpan mesh ke array
  scene.add(planetMesh); // Menambahkan mesh ke dalam scene
});

// Menambahkan cincin Saturnus
const saturnRingTexture = new THREE.TextureLoader().load("textures/saturnRing.jpeg"); // Memuat tekstur cincin
const saturnRingGeometry = new THREE.RingGeometry(1.5, 2, 32); // Geometri untuk cincin Saturnus
const saturnRingMaterial = new THREE.MeshBasicMaterial({ map: saturnRingTexture, side: THREE.DoubleSide }); // Material cincin
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial); // Membuat mesh untuk cincin
saturnRing.position.set(-4, -12, 0); // Mengatur posisi cincin
saturnRing.rotation.x = Math.PI / 2; // Rotasi cincin di sumbu X
saturnRing.rotation.y = Math.PI / 4; // Rotasi cincin di sumbu Y
scene.add(saturnRing); // Menambahkan cincin ke dalam scene

// Fungsi untuk membuat popup deskripsi planet
function createPopup(name, desc) {
  const popup = document.createElement('div'); // Membuat elemen div untuk popup
  popup.style.position = 'fixed'; // Menetapkan posisi tetap
  popup.style.left = `3000px`; // Koordinat X (default)
  popup.style.top = `1000px`; // Koordinat Y (default)
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Warna latar belakang popup
  popup.style.color = 'white'; // Warna teks
  popup.style.padding = '20px'; // Jarak dalam popup
  popup.style.borderRadius = '10px'; // Sudut melengkung
  popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // Efek bayangan
  popup.style.textAlign = 'center'; // Teks rata tengah
  popup.style.fontSize = '80px'; // Ukuran font
  popup.style.opacity = '0'; // Transparansi awal
  popup.style.transition = 'opacity 0.5s ease-in-out'; // Efek transisi untuk kemunculan

  const title = document.createElement('h2'); // Membuat elemen judul
  title.textContent = name; // Menetapkan teks judul
  const description = document.createElement('p'); // Membuat elemen paragraf
  description.textContent = desc; // Menetapkan teks deskripsi

  const closeButton = document.createElement('button'); // Membuat tombol tutup
  closeButton.textContent = 'Close'; // Teks pada tombol
  closeButton.style.marginTop = '10px'; // Margin atas
  closeButton.style.padding = '10px 20px'; // Padding tombol
  closeButton.style.border = 'none'; // Tanpa border
  closeButton.style.backgroundColor = '#ff5722'; // Warna tombol
  closeButton.style.color = 'white'; // Warna teks tombol
  closeButton.style.borderRadius = '5px'; // Sudut tombol melengkung
  closeButton.style.cursor = 'pointer'; // Mengatur kursor saat diarahkan ke tombol
  closeButton.style.fontSize = '50px'; // Ukuran font tombol

  // Event listener untuk menutup popup saat tombol di-klik
  closeButton.addEventListener('click', () => {
    popup.style.opacity = '0'; // Menyembunyikan popup
    setTimeout(() => document.body.removeChild(popup), 500); // Menghapus popup dari dokumen setelah transisi
  });

  popup.appendChild(title); // Menambahkan judul ke popup
  popup.appendChild(description); // Menambahkan deskripsi ke popup
  popup.appendChild(closeButton); // Menambahkan tombol tutup ke popup
  document.body.appendChild(popup); // Menambahkan popup ke dokumen

  setTimeout(() => {
    popup.style.opacity = '1'; // Menampilkan popup setelah delay
  }, 10);
}

// Event listener untuk menangkap input keyboard
function handleKeyPress(event) {
  const key = event.key; // Mendapatkan tombol yang ditekan
  if (key >= '0' && key <= '9') { // Jika tombol adalah angka
    const planetIndex = parseInt(key) - 1; // Mengubah angka menjadi indeks
    if (planetIndex < planetMeshes.length) { // Jika indeks valid
      const planet = planetMeshes[planetIndex]; // Mengambil planet sesuai indeks
      createPopup(planet.name, planet.desc); // Membuat popup deskripsi planet
    }
  }
}
document.addEventListener('keypress', handleKeyPress); // Menambahkan event listener pada dokumen

// Fungsi animasi
function animate() {
  planetMeshes.forEach(planet => {
    planet.mesh.rotation.y += 0.01; // Rotasi setiap planet
  });
  saturnRing.rotation.z += 0.01; // Rotasi cincin Saturnus
  renderer.render(scene, camera); // Render scene dan kamera
  requestAnimationFrame(animate); // Meminta frame berikutnya untuk animasi
}
animate(); // Memulai animasi