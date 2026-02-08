<script setup lang="ts">
import * as v from 'valibot';

const roomStore = useRoomStore();

const state = ref({ ...roomStore.config });
const schema = v.object({
  type: v.picklist(roomStore.TYPES.map(x => x.value)),
  width: v.pipe(v.number(), v.minValue(150), v.maxValue(800)),
  depth: v.pipe(v.number(), v.minValue(150), v.maxValue(800)),
});
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
      :schema
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
