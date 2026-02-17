<script setup lang="ts">
const rootRef = useTemplateRef('root');

const roomStore = useRoomStore();

onMounted(() => {
  watchEffect((onCleanup) => {
    if (!rootRef.value || !roomStore.config || !roomStore.furnitures) return;
    const cleanup = processRoom(rootRef.value, {
      width: roomStore.config.width / 100,
      depth: roomStore.config.depth / 100,
      furnitures: roomStore.furnitures,
    });

    onCleanup(cleanup);
  });
});
</script>

<template>
  <section
    ref="root"
    class="order-3 lg:order-0"
  />
</template>
