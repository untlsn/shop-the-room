<script setup lang="ts">
const roomStore = useRoomStore();

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living-room', label: 'Living Room' },
  { value: 'office', label: 'Office' },
];
</script>

<template>
  <UCard>
    <template
      #header
    >
      Room Configuration
    </template>

    <UForm
      class="grid gap-4"
      @submit="roomStore.generate(); $emit('submit')"
    >
      <UFormField
        label="Room Type"
      >
        <USelect
          v-model="roomStore.config.type"
          :items="ROOM_TYPES"
          value-key="value"
          class="w-full"
        />
      </UFormField>

      <UFormField
        class="w-full"
        label="Width (cm)"
        help="150 - 800 cm"
      >
        <UInputNumber
          v-model="roomStore.config.width"
          class="w-full"
          :min="150"
          :max="800"
          orientation="vertical"
        />
      </UFormField>

      <UFormField
        class="w-full"
        label="Depth (cm)"
        help="150 - 800 cm"
      >
        <UInputNumber
          v-model="roomStore.config.depth"
          class="w-full"
          :min="150"
          :max="800"
          orientation="vertical"
        />
      </UFormField>

      <UButton
        type="submit"
        icon="lucide:arrow-right"
        class="mx-auto"
      >
        Generate Layout
      </UButton>
    </UForm>
  </UCard>
</template>
