<script setup lang="ts">
import * as THREE from 'three';

// Stan (Reactive State)
const isFloorPlanView = ref(false);
const floorPlanImage = ref<string>('');

// Referencje do elementów i obiektów Three.js
const containerRef = ref<HTMLDivElement | null>(null);
const sceneRef = shallowRef<THREE.Scene | null>(null);
const cameraRef = shallowRef<THREE.PerspectiveCamera | null>(null);
const rendererRef = shallowRef<THREE.WebGLRenderer | null>(null);
const controlsRef = shallowRef<FirstPersonControls | null>(null);
const floorPlanRef = shallowRef<FloorPlanRenderer | null>(null);

const handleResize = () => {
  if (!cameraRef.value || !rendererRef.value) return;
  cameraRef.value.aspect = window.innerWidth / window.innerHeight;
  cameraRef.value.updateProjectionMatrix();
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
};

onMounted(() => {
  if (!containerRef.value) return;

  // Inicjalizacja Sceny
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);
  sceneRef.value = scene;

  // Kamera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 1.6, 0);
  cameraRef.value = camera;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  containerRef.value.appendChild(renderer.domElement);
  rendererRef.value = renderer;

  // Światła
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xFFE4B5, 0.5, 15);
  pointLight.position.set(0, 2.5, 0);
  scene.add(pointLight);

  // Budowanie pokoju
  createRoom(scene, sampleRoomPlan);
  createFurniture(scene, sampleRoomPlan);

  // Floor Plan
  const floorPlan = new FloorPlanRenderer(1024, 1024, 50);
  floorPlanRef.value = floorPlan;
  floorPlanImage.value = floorPlan.getImageData();

  // Kontrolery
  const controls = new FirstPersonControls(camera, renderer.domElement);
  controlsRef.value = controls;

  window.addEventListener('resize', handleResize);

  const animate = () => {
    if (!rendererRef.value || !sceneRef.value || !cameraRef.value) return;
    requestAnimationFrame(animate);
    rendererRef.value.render(sceneRef.value, cameraRef.value);
  };
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  controlsRef.value?.dispose();
  rendererRef.value?.dispose();
});

const handleDownload = () => {
  if (floorPlanRef.value) {
    floorPlanRef.value.downloadImage('floor-plan.png');
  }
};
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <template v-if="!isFloorPlanView">
      <div
        ref="containerRef"
        class="w-full h-full"
      />

      <div class="absolute top-4 left-4 bg-black/60 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm">
        <h1 class="text-xl font-bold mb-2">
          3D Room Viewer
        </h1>
        <p class="text-sm">
          Click to activate controls
        </p>
        <p class="text-sm">
          Move mouse to look around
        </p>
        <p class="text-sm text-gray-300 mt-1">
          Press ESC to exit
        </p>
      </div>

      <button
        class="absolute top-4 right-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 font-medium"
        @click="isFloorPlanView = true"
      >
        <UIcon
          name="lucide:layers"
          class="w-5 h-5"
        />
        Floor Plan
      </button>
    </template>

    <div
      v-else
      class="w-full h-full bg-gray-100 flex items-center justify-center p-4"
    >
      <div class="flex flex-col items-center gap-4">
        <img
          :src="floorPlanImage"
          alt="Floor Plan"
          class="max-w-4xl max-h-[80vh] border-4 border-gray-300 rounded-lg shadow-lg"
        >

        <div class="flex gap-3">
          <button
            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
            @click="isFloorPlanView = false"
          >
            Back to 3D
          </button>

          <button
            class="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
            @click="handleDownload"
          >
            <UIcon
              name="lucide:download"
              class="w-5 h-5"
            />
            Export Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
