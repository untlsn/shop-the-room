import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import type { ShallowReactive } from 'vue';

const roomHeight = 2.5;

type Cords3D = readonly [x: number, y: number, z: number];
type Cords2D = readonly [x: number, z: number];

export function processRoom(wrapper: HTMLElement, { width, depth }: {
  width: number;
  depth: number;
}) {
  const rect = wrapper.getBoundingClientRect();
  const scene = createScene();

  const renderer = createRenderer(rect);
  wrapper.appendChild(renderer.domElement);

  const camera = createCamera(rect);
  const controls = new OrbitControls(camera, renderer.domElement);

  const verticalWallSize = [width, roomHeight] as const;
  const horizontalWallSize = [depth, roomHeight] as const;

  scene.add(
    createWall({
      size: verticalWallSize,
      position: convertEdgeToCenter(0, roomHeight, depth),
      rotation: Math.PI,
    }),
    createWall({
      size: verticalWallSize,
      position: convertEdgeToCenter(0, roomHeight, -depth),
      rotation: 0,
    }),
    createWall({
      size: horizontalWallSize,
      position: convertEdgeToCenter(width, roomHeight, 0),
      rotation: Math.PI / -2,
    }),
    createWall({
      size: horizontalWallSize,
      position: convertEdgeToCenter(-width, roomHeight, 0),
      rotation: Math.PI / 2,
    }),
    createFloor(width, depth),
    new THREE.AmbientLight(0xffffff, 0.5),
    createPointLight(),
    createCube(),
  );

  let animationId: number;

  const loop = () => {
    animationId = requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
  };

  loop();

  return () => {
    cancelAnimationFrame(animationId);
    renderer.domElement.remove();
    renderer.dispose();
  };
}

function createCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  const cube = new THREE.Mesh(geometry, material);
  cube.position.y = 0.5;

  return cube;
}

function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  return scene;
}

function createCamera(rect: DOMRect) {
  const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
  camera.position.set(3, 3, 5);

  return camera;
}
function createRenderer(rect: DOMRect) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(rect.width, rect.height);

  return renderer;
}

function createWall({ size, position, rotation }: {
  size: Cords2D;
  position: Cords3D;
  rotation: number;
}) {
  const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee }); // Białe ściany

  const wall = new THREE.Mesh(new THREE.PlaneGeometry(...size), material);
  wall.position.set(...position); // Ustawienie na krawędzi podłogi
  wall.receiveShadow = true;
  wall.castShadow = true;

  wall.rotation.y = rotation;

  material.side = THREE.FrontSide;

  return wall;
}
function createFloor(...cords: Cords2D) {
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xbc8e5a }); // Drewnopodobny
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(...cords), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  return floor;
}
function createPointLight() {
  const pointLight = new THREE.PointLight(0xffffff, 50);
  pointLight.position.set(2, 3, 4);

  return pointLight;
}

/**
 * Three.js use center as position,
 * but because sizes of the room are defined from edge to edge
 * it's easier to just use this function istead of adding `/ 2` everywhere
 */
function convertEdgeToCenter(...cords: Cords3D): Cords3D {
  return [cords[0] / 2, cords[1] / 2, cords[2] / 2];
}
