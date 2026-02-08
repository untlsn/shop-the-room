<script lang="ts" setup>
const roomStore = useRoomStore();
</script>

<template>
  <UCard
    v-if="!roomStore.empty"
    class="mt-4"
    :ui="{ header: 'border-0 pb-0', body: 'grid gap-2' }"
  >
    <template
      #header
    >
      Legend
    </template>
    <div
      v-for="item in roomStore.uniqueFurnitures"
      :key="item.id"
      class="flex items-center gap-2"
    >
      <div
        class="size-3 rounded-sm"
        :style="{ backgroundColor: item.color }"
        aria-hidden="true"
      />
      <span class="text-xs text-foreground">
        {{ item.name }}
      </span>
    </div>
  </UCard>
</template>
