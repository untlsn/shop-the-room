<script setup lang="ts">
const rootRef = useTemplateRef('root');

const { is3D } = useRoomEngine(rootRef);
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
