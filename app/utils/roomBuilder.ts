import * as THREE from 'three';

export function createRoom(scene: THREE.Scene, plan: RoomPlan) {
  const { width, depth, wallHeight } = plan;

  const floorGeometry = new THREE.BoxGeometry(width, 0.1, depth);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xE8E8E8 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.05;
  floor.receiveShadow = true;
  scene.add(floor);

  const ceilingGeometry = new THREE.BoxGeometry(width, 0.1, depth);
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.position.y = wallHeight + 0.05;
  scene.add(ceiling);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xF5F5DC,
    side: THREE.DoubleSide,
  });

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(width, wallHeight, 0.1),
    wallMaterial,
  );
  backWall.position.set(0, wallHeight / 2, -depth / 2);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(width, wallHeight, 0.1),
    wallMaterial,
  );
  frontWall.position.set(0, wallHeight / 2, depth / 2);
  frontWall.receiveShadow = true;
  scene.add(frontWall);

  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, wallHeight, depth),
    wallMaterial,
  );
  leftWall.position.set(-width / 2, wallHeight / 2, 0);
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, wallHeight, depth),
    wallMaterial,
  );
  rightWall.position.set(width / 2, wallHeight / 2, 0);
  rightWall.receiveShadow = true;
  scene.add(rightWall);
}

export function createFurniture(scene: THREE.Scene, plan: RoomPlan) {
  plan.furniture.forEach((item) => {
    const geometry = new THREE.BoxGeometry(item.width, item.height, item.depth);
    const material = new THREE.MeshStandardMaterial({ color: item.color });
    const furniture = new THREE.Mesh(geometry, material);

    furniture.position.set(
      item.x,
      item.height / 2,
      item.z,
    );

    furniture.castShadow = true;
    furniture.receiveShadow = true;

    scene.add(furniture);
  });
}
