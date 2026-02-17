import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type Nil = null | undefined;

export function useRoomEngine(rootRef: Ref<HTMLElement | Nil>) {
  const is3D = ref(false);

  const roomStore = useRoomStore();

  const room = computed(() => {
    if (!roomStore.config) return undefined;

    return new THREE.Vector3(roomStore.config.width / 100, 2.5, roomStore.config.depth / 100);
  });

  const { data: wallMaterial } = useQuery(wallMaterialQuery);

  onMounted(() => {
    const verticalWallSize = computed(() => room.value ? new THREE.Vector2(room.value.x, room.value.y) : undefined);
    const horizontalWallSize = computed(() => room.value ? new THREE.Vector2(room.value.z, room.value.y) : undefined);

    const walls = [
      createWall({
        size: verticalWallSize,
        position: computed(() => room.value ? convertEdgeToCenter(0, room.value.y, room.value.z) : undefined),
        rotation: Math.PI,
        material: wallMaterial,
      }),
      createWall({
        size: verticalWallSize,
        position: computed(() => room.value ? convertEdgeToCenter(0, room.value.y, -room.value.z) : undefined),
        rotation: 0,
        material: wallMaterial,
      }),
      createWall({
        size: horizontalWallSize,
        position: computed(() => room.value ? convertEdgeToCenter(room.value.x, room.value.y, 0) : undefined),
        rotation: Math.PI / -2,
        material: wallMaterial,
      }),
      createWall({
        size: horizontalWallSize,
        position: computed(() => room.value ? convertEdgeToCenter(-room.value.x, room.value.y, 0) : undefined),
        rotation: Math.PI / 2,
        material: wallMaterial,
      }),
    ];

    watchEffect((onCleanup) => {
      const wrapper = rootRef.value!;
      if (!wrapper || !room.value || !roomStore.furnitures) return;
      const rect = wrapper.getBoundingClientRect();
      const scene = createScene();

      const renderer = createRenderer(rect);
      wrapper.appendChild(renderer.domElement);

      const [camera3D, camera2D] = createCameras(rect, room.value);
      const controls = new OrbitControls(camera3D, renderer.domElement);
      watchEffect(() => {
        controls.enabled = !!is3D.value;
      });

      scene.add(
        ...walls,
        createFloor(room.value.x, room.value.z),
        new THREE.AmbientLight(0xffffff, 1),
        createPointLight(room.value.y),
      );

      const loader = new GLTFLoader();

      roomStore.furnitures.forEach(async (furniture) => {
        const { scene: model } = await loader.loadAsync(furniture.modelSource);
        setAbsoluteScale(model, furniture.size);
        model.position.copy(furniture.position);
        if (furniture.rotation) model.rotation.copy(furniture.rotation);
        scene.add(model);
      });

      const loop = () => {
        animationId = requestAnimationFrame(loop);
        controls.update();
        renderer.render(scene, is3D.value ? camera3D : camera2D);
      };

      let animationId = requestAnimationFrame(loop);

      onCleanup(() => {
        cancelAnimationFrame(animationId);
        renderer.domElement.remove();
        renderer.dispose();
      });
    });
  });

  return {
    is3D,
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

function createWall({ size, position, rotation, material }: {
  size: Ref<THREE.Vector2 | undefined>;
  position: Ref<THREE.Vector3 | undefined>;
  rotation: number;
  material: Ref<THREE.MeshStandardMaterial | undefined>;
}) {
  const wall = Object.assign(new THREE.Mesh(), {
    receiveShadow: true,
    castShadow: true,
  });

  watchEffect(() => {
    if (material.value) wall.material = material.value;
  });

  watchEffect(() => {
    if (!size.value) return;
    const geometry = new THREE.PlaneGeometry(...size.value);
    geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv!.array, 2));

    wall.geometry = geometry;
    onWatcherCleanup(() => {
      geometry.dispose();
    });
  });
  watchEffect(() => {
    if (position.value) wall.position.copy(position.value);
  });

  wall.rotation.y = rotation;

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

const wallMaterialQuery = defineQueryOptions(() => {
  return {
    key: ['wallMaterial'],
    query: async () => {
      if (import.meta.server) return undefined;
      const loader = new THREE.TextureLoader();

      const normalMap = await loader.loadAsync('/textures/Plaster001_1K-JPG/Plaster001_1K-JPG_NormalDX.jpg');
      const roughnessMap = await loader.loadAsync('/textures/Plaster001_1K-JPG/Plaster001_1K-JPG_Roughness.jpg');

      addTextureWrapping(normalMap);
      addTextureWrapping(roughnessMap);

      const material = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        normalMap,
        roughnessMap,
      });
      material.side = THREE.FrontSide;

      return material;
    },
  };
});

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
function createPointLight(roomY: number) {
  const pointLight = new THREE.PointLight(0xffffff, 5);
  pointLight.position.set(0.5, roomY, 0.5);

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
function setAbsoluteScale(model: THREE.Group<THREE.Object3DEventMap>, size: THREE.Vector3) {
  const box = new THREE.Box3().setFromObject(model);
  const modelActualSize = new THREE.Vector3();
  box.getSize(modelActualSize);

  console.log(modelActualSize);

  model.scale.x = size.x / modelActualSize.x;
  model.scale.y = size.y / modelActualSize.y;
  model.scale.z = size.z / modelActualSize.z;
}
function addTextureWrapping(texture: THREE.Texture<HTMLImageElement>) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
}
