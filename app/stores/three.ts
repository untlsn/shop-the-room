import * as THREE from 'three';

function createAmbientLight() {
  return new THREE.AmbientLight(0xffffff, 0.6);
}
function createDirectionalLight() {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;

  return directionalLight;
}
function createPointLight() {
  const pointLight = new THREE.PointLight(0xFFE4B5, 0.5, 15);
  pointLight.position.set(0, 2.5, 0);

  return pointLight;
}

export const useThreeStore = defineStore('three', () => {
  const scene = shallowRef<THREE.Scene>();
  const camera = shallowRef<THREE.PerspectiveCamera>();
  const renderer = shallowRef<THREE.WebGLRenderer>();
  const controls = shallowRef<FirstPersonControls>();
  const floorPlan = shallowRef<FloorPlanRenderer>();
  const container = shallowRef<HTMLElement>();

  const animate = () => {
    if (!renderer.value || !scene.value || !camera.value) throw createError('Cannot animate without renderer, scene, and camera');
    requestAnimationFrame(animate);
    renderer.value.render(scene.value, camera.value);
  };

  return {
    scene,
    camera,
    renderer,
    controls,
    floorPlan,

    floorPlanImage: computed(() => floorPlan.value?.getImageData()),

    initScene() {
      scene.value = Object.assign(new THREE.Scene(), {
        background: new THREE.Color(0x87CEEB),
      });

      scene.value
        .add(createAmbientLight())
        .add(createDirectionalLight())
        .add(createPointLight());

      return this;
    },
    initCamera() {
      camera.value = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.value.position.set(0, 1.6, 0);

      return this;
    },
    initRenderer(containerValue: HTMLElement) {
      container.value = containerValue;

      renderer.value = new THREE.WebGLRenderer({ antialias: true });
      renderer.value.setSize(window.innerWidth, window.innerHeight);
      Object.assign(renderer.value.shadowMap, {
        enabled: true,
        type: THREE.PCFSoftShadowMap,
      });

      container.value.appendChild(renderer.value.domElement);

      return this;
    },
    initFloorPlan() {
      floorPlan.value = new FloorPlanRenderer(1024, 1024, 50);

      return this;
    },
    initControls() {
      if (!camera.value || !renderer.value) throw createError('Cannot initialize controls without a camera and renderer');

      controls.value = new FirstPersonControls(camera.value, renderer.value.domElement);

      return this;
    },
    createRoom() {
      if (!scene.value) throw createError('Cannot create room without a scene');
      createRoom(scene.value, sampleRoomPlan);

      return this;
    },
    createFurniture() {
      if (!scene.value) throw createError('Cannot create furniture without a scene');
      createFurniture(scene.value, sampleRoomPlan);

      return this;
    },

    animate,

    dispose() {
      controls.value?.dispose();
      renderer.value?.dispose();
    },

    handleResize() {
      if (!camera.value || !renderer.value) throw createError('Cannot handle resize without camera and renderer');
      camera.value.aspect = window.innerWidth / window.innerHeight;
      camera.value.updateProjectionMatrix();
      renderer.value.setSize(window.innerWidth, window.innerHeight);
    },

    downloadPlan() {
      if (!floorPlan.value) return;
      floorPlan.value.downloadImage('floor-plan.png');
    },
  };
});
