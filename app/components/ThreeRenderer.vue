<script setup lang="ts">
const isFloorPlanView = ref(false);
const containerRef = useTemplateRef('containerRef');
const threeStore = useThreeStore();

defineEmits<{
  (e: 'close'): void;
}>();

onMounted(() => {
  if (!containerRef.value) return;

  threeStore
    .initScene()
    .initCamera()
    .initRenderer(containerRef.value)
    .createRoom()
    .createFurniture()
    .initFloorPlan()
    .initControls();

  window.addEventListener('resize', threeStore.handleResize);

  threeStore.animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', threeStore.handleResize);
  threeStore.dispose();
});
</script>

<template>
  <div class="relative size-full m-auto overflow-hidden">
    <template v-if="!isFloorPlanView">
      <div
        ref="containerRef"
        class="size-full"
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

      <UButton
        class="absolute top-4 right-4"
        color="error"
        @click="$emit('close')"
      >
        Close
      </UButton>
      <UButton
        class="absolute bottom-4 right-4"
        icon="lucide:layers"
        @click="isFloorPlanView = true"
      >
        Floor Plan
      </UButton>
    </template>

    <div
      v-else
      class="w-full h-full bg-gray-100 flex items-center justify-center p-4"
    >
      <div class="flex flex-col items-center gap-4">
        <img
          :src="threeStore.floorPlanImage"
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
            @click="threeStore.downloadPlan"
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
