<script setup lang="ts">
const roomStore = useRoomStore();

const state = ref({ ...roomStore.config });
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
      :state
      @submit="roomStore.generate({ ...state });"
    >
      <UFormField
        label="Room Type"
      >
        <USelect
          v-model="state.type"
          :items="roomStore.TYPES"
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
          v-model="state.width"
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
          v-model="state.depth"
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
