import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 4, 8);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 5);
scene.add(dir);

const LANE_WIDTH = 2;
const TRACK_LENGTH = 200;

const groundGeo = new THREE.PlaneGeometry(LANE_WIDTH * 3, TRACK_LENGTH);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.z = -TRACK_LENGTH / 2 + 10;
scene.add(ground);

for (let i = -1; i <= 1; i += 2) {
  const lineGeo = new THREE.PlaneGeometry(0.1, TRACK_LENGTH);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.set(i * LANE_WIDTH / 2, 0.01, -TRACK_LENGTH / 2 + 10);
  scene.add(line);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function loop() {
  requestAnimationFrame(loop);
  renderer.render(scene, camera);
}
loop();
