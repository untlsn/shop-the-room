<script setup lang="ts">
const rootRef = useTemplateRef('root');

const roomStore = useRoomStore();

onMounted(() => {
  watchEffect((onCleanup) => {
    if (!rootRef.value || !roomStore.config.width || !roomStore.config.depth) return;
    const cleanup = processRoom(rootRef.value, {
      width: roomStore.config.width / 100,
      depth: roomStore.config.depth / 100,
      roomType: roomStore.config.type,
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
