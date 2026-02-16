import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const roomHeight = 2.5;

type Cords3D = readonly [x: number, y: number, z: number];
type Cords2D = readonly [x: number, z: number];

export function processRoom(wrapper: HTMLElement, { width, depth }: {
  width: number;
  depth: number;
  furnitures: PlacedFurniture[];
}) {
  const furnitures = furnitureSelector(new THREE.Vector2(
    width,
    depth,
  ));

  const rect = wrapper.getBoundingClientRect();
  const scene = createScene();

  const renderer = createRenderer(rect);
  wrapper.appendChild(renderer.domElement);

  const camera = createCamera(rect);
  const controls = new OrbitControls(camera, renderer.domElement);

  const verticalWallSize = [width, roomHeight] as const;
  const horizontalWallSize = [depth, roomHeight] as const;
  const wallTexture = createWallTexture();

  scene.add(
    createWall({
      size: verticalWallSize,
      position: convertEdgeToCenter(0, roomHeight, depth),
      rotation: Math.PI,
      texture: wallTexture,
    }),
    createWall({
      size: verticalWallSize,
      position: convertEdgeToCenter(0, roomHeight, -depth),
      rotation: 0,
      texture: wallTexture,
    }),
    createWall({
      size: horizontalWallSize,
      position: convertEdgeToCenter(width, roomHeight, 0),
      rotation: Math.PI / -2,
      texture: wallTexture,
    }),
    createWall({
      size: horizontalWallSize,
      position: convertEdgeToCenter(-width, roomHeight, 0),
      rotation: Math.PI / 2,
      texture: wallTexture,
    }),
    createFloor(width, depth),
    new THREE.AmbientLight(0xffffff, 1),
    createPointLight(),
  );

  const loader = new GLTFLoader();

  furnitures.forEach(async (furniture) => {
    const { scene: model } = await loader.loadAsync(furniture.modelSource);
    setAbsoluteScale(model, furniture.size);
    model.position.copy(furniture.position);
    if (furniture.rotation) model.rotation.copy(furniture.rotation);
    scene.add(model);
  });

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

function createWall({ size, position, rotation, texture }: {
  size: Cords2D;
  position: Cords3D;
  rotation: number;
  texture: ReturnType<typeof createWallTexture>;
}) {
  const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee, ...texture });
  const geometry = new THREE.PlaneGeometry(...size);
  geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv!.array, 2));

  const wall = new THREE.Mesh(geometry, material);
  wall.position.set(...position); // Ustawienie na krawędzi podłogi
  wall.receiveShadow = true;
  wall.castShadow = true;

  wall.rotation.y = rotation;

  material.side = THREE.FrontSide;

  return wall;
}

function createFloorTexture() {
  const loader = new THREE.TextureLoader();

  const map = loader.load('/textures/WoodFloor051_1K-JPG/WoodFloor051_1K-JPG_Color.jpg');
  const normalMap = loader.load('/textures/WoodFloor051_1K-JPG/WoodFloor051_1K-JPG_NormalDX.jpg');
  const roughnessMap = loader.load('/textures/WoodFloor051_1K-JPG/WoodFloor051_1K-JPG_Roughness.jpg');
  const aoMap = loader.load('/textures/WoodFloor051_1K-JPG/WoodFloor051_1K-JPG_AmbientOcclusion.jpg');

  [map, normalMap, roughnessMap, aoMap].forEach((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
  });

  return {
    map,
    normalMap,
    roughnessMap,
    aoMap,
  };
}

function createWallTexture() {
  const loader = new THREE.TextureLoader();

  const normalMap = loader.load('/textures/Plaster001_1K-JPG/Plaster001_1K-JPG_NormalDX.jpg');
  const roughnessMap = loader.load('/textures/Plaster001_1K-JPG/Plaster001_1K-JPG_Roughness.jpg');

  [normalMap, roughnessMap].forEach((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
  });

  return {
    normalMap,
    roughnessMap,
  };
}

function createFloor(...cords: Cords2D) {
  const material = new THREE.MeshStandardMaterial({
    ...createFloorTexture(),
    roughness: 0.8,
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(...cords), material);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  return floor;
}
function createPointLight() {
  const pointLight = new THREE.PointLight(0xffffff, 5);
  pointLight.position.set(0.5, roomHeight, 0.5);

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
function setAbsoluteScale(model: THREE.Group<THREE.Object3DEventMap>, size: THREE.Vector3) {
  const box = new THREE.Box3().setFromObject(model);
  const modelActualSize = new THREE.Vector3();
  box.getSize(modelActualSize);

  model.scale.x = size.x / modelActualSize.x;
  model.scale.y = size.y / modelActualSize.y;
  model.scale.z = size.z / modelActualSize.z;
}
