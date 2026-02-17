<script setup lang="ts">
const rootRef = useTemplateRef('root');

const roomStore = useRoomStore();

const is3D = ref(false);

onMounted(() => {
  watchEffect((onCleanup) => {
    if (!rootRef.value || !roomStore.config || !roomStore.furnitures) return;
    const cleanup = processRoom(rootRef.value, {
      width: roomStore.config.width / 100,
      depth: roomStore.config.depth / 100,
      furnitures: roomStore.furnitures,
      is3D: is3D.value,
    });

    onCleanup(cleanup);
  });
});
</script>

<template>
  <section
    ref="root"
    class="order-3 lg:order-0"
  >
    <div class="flex items-center gap-2">
      <p class="font-medium text-default text-sm">
        2D
      </p>
      <USwitch
        v-model="is3D"
        label="3D"
      />
    </div>
  </section>
</template>
