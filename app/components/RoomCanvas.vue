<script setup lang="ts">
const rootRef = useTemplateRef('root');

onMounted(() => {
  if (!rootRef.value) return;

  const cleanup = processRoom(rootRef.value);
  onUnmounted(cleanup);
});
</script>

<template>
  <section
    ref="root"
    class="order-3 lg:order-0"
  />
</template>
