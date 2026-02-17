import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const roomHeight = 2.5;

export function processRoom(wrapper: HTMLElement, config: {
  width: number;
  depth: number;
  furnitures: FurnitureComputedData[];
  is3D: Ref<boolean>;
}) {
  const room = new THREE.Vector3(config.width, roomHeight, config.depth);
  const rect = wrapper.getBoundingClientRect();
  const scene = createScene();

  const renderer = createRenderer(rect);
  wrapper.appendChild(renderer.domElement);

  const [camera3D, camera2D] = createCameras(rect, room);
  const controls = new OrbitControls(camera3D, renderer.domElement);
  watchEffect(() => {
    controls.enabled = !!config.is3D.value;
  });

  const verticalWallSize = new THREE.Vector2(room.x, room.y);
  const horizontalWallSize = new THREE.Vector2(room.z, room.y);
  const wallTexture = createWallTexture();

  scene.add(
    createWall({
      size: verticalWallSize,
      position: convertEdgeToCenter(0, roomHeight, room.z),
      rotation: Math.PI,
      texture: wallTexture,
    }),
    createWall({
      size: verticalWallSize,
      position: convertEdgeToCenter(0, roomHeight, -room.z),
      rotation: 0,
      texture: wallTexture,
    }),
    createWall({
      size: horizontalWallSize,
      position: convertEdgeToCenter(room.x, roomHeight, 0),
      rotation: Math.PI / -2,
      texture: wallTexture,
    }),
    createWall({
      size: horizontalWallSize,
      position: convertEdgeToCenter(-room.x, roomHeight, 0),
      rotation: Math.PI / 2,
      texture: wallTexture,
    }),
    createFloor(room.x, room.z),
    new THREE.AmbientLight(0xffffff, 1),
    createPointLight(),
  );

  const loader = new GLTFLoader();

  config.furnitures.forEach(async (furniture) => {
    const { scene: model } = await loader.loadAsync(furniture.modelSource);
    setAbsoluteScale(model, furniture.size);
    model.position.copy(furniture.position);
    if (furniture.rotation) model.rotation.copy(furniture.rotation);
    scene.add(model);
  });

  const loop = () => {
    animationId = requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, config.is3D.value ? camera3D : camera2D);
  };

  let animationId = requestAnimationFrame(loop);

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

function create2DCamera(rect: DOMRect, room: THREE.Vector3) {
  const aspect = rect.width / rect.height;
  const max = Math.max(room.x, room.z);

  const camera = new THREE.OrthographicCamera(
    -max * aspect / 2,
    max * aspect / 2,
    max / 2,
    -max / 2,
    0.1,
    1000,
  );
  camera.position.set(0, 3, 0);
  camera.lookAt(0, 0, 0);

  return camera;
}

function create3DCamera(rect: DOMRect) {
  const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
  camera.position.set(3, 3, 5);

  return camera;
}

function createCameras(rect: DOMRect, room: THREE.Vector3) {
  return [
    create3DCamera(rect),
    create2DCamera(rect, room),
  ] as const;
}
function createRenderer(rect: DOMRect) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(rect.width, rect.height);

  return renderer;
}

function createWall({ size, position, rotation, texture }: {
  size: THREE.Vector2;
  position: THREE.Vector3;
  rotation: number;
  texture: ReturnType<typeof createWallTexture>;
}) {
  const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee, ...texture });
  const geometry = new THREE.PlaneGeometry(...size);
  geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv!.array, 2));

  const wall = new THREE.Mesh(geometry, material);
  wall.position.copy(position); // Ustawienie na krawędzi podłogi
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

function createFloor(x: number, y: number) {
  const material = new THREE.MeshStandardMaterial({
    ...createFloorTexture(),
    roughness: 0.8,
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(x, y), material);
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
function convertEdgeToCenter(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x / 2, y / 2, z / 2);
}
function setAbsoluteScale(model: THREE.Group<THREE.Object3DEventMap>, size: THREE.Vector3, a?: boolean) {
  const box = new THREE.Box3().setFromObject(model);
  const modelActualSize = new THREE.Vector3();
  box.getSize(modelActualSize);

  console.log(modelActualSize);

  model.scale.x = size.x / modelActualSize.x;
  model.scale.y = size.y / modelActualSize.y;
  model.scale.z = size.z / modelActualSize.z;
}
