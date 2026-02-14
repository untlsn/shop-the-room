<script setup lang="ts">
const rootRef = useTemplateRef('root');

const props = defineProps<{
  width: number;
  depth: number;
}>();

onMounted(() => {
  watchEffect((onCleanup) => {
    if (!rootRef.value || !props.depth || !props.width) return;
    const cleanup = processRoom(rootRef.value, {
      width: props.width,
      depth: props.depth,
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
