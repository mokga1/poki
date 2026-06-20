import * as THREE from 'three';

// 하늘: 파스텔 그라데이션 배경 + 무지개 + 떠다니는 구름

const RAINBOW_COLORS = [0xff5e5e, 0xffa552, 0xffe04d, 0x7ed957, 0x5ec8ff, 0x6a7bff, 0xb86aff];

export function createSky(scene) {
  scene.background = makeGradientTexture();

  const rainbow = makeRainbow();
  rainbow.position.set(0, 0, -140);
  scene.add(rainbow);

  const clouds = [];
  const cloudSpots = [
    [-25, 16, -100], [18, 20, -120], [-10, 22, -140], [30, 14, -90], [5, 18, -70],
  ];
  for (const [x, y, z] of cloudSpots) {
    const cloud = makeCloud();
    cloud.position.set(x, y, z);
    cloud.userData.baseX = x;
    clouds.push(cloud);
    scene.add(cloud);
  }

  return { clouds, time: 0 };
}

export function updateSky(sky, dt) {
  sky.time += dt;
  sky.clouds.forEach((cloud, i) => {
    cloud.position.x = cloud.userData.baseX + Math.sin(sky.time * 0.2 + i * 1.7) * 3;
  });
}

function makeGradientTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#9fdcff');   // 위: 맑은 하늘색
  grad.addColorStop(0.55, '#ffd1ec'); // 중간: 솜사탕 분홍
  grad.addColorStop(1, '#ffeaf6');   // 아래: 연한 분홍
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2, 256);
  return new THREE.CanvasTexture(canvas);
}

function makeRainbow() {
  const group = new THREE.Group();
  RAINBOW_COLORS.forEach((color, i) => {
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(34 - i * 1.3, 0.65, 8, 48, Math.PI),
      new THREE.MeshBasicMaterial({ color }),
    );
    group.add(arc);
  });
  return group;
}

function makeCloud() {
  const group = new THREE.Group();
  // Basic 머티리얼: 조명 영향 없이 항상 새하얀 만화풍 구름
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const lumps = [
    [0, 0, 0, 2.2], [-2, -0.3, 0.3, 1.6], [2, -0.2, -0.2, 1.7], [0.8, 0.8, 0, 1.4],
  ];
  for (const [x, y, z, r] of lumps) {
    const lump = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), mat);
    lump.position.set(x, y, z);
    lump.scale.y = 0.6;
    group.add(lump);
  }
  return group;
}
