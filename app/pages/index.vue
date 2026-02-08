<script setup lang="ts">
// --- State ---
const config = ref<RoomConfig>({
  width: 400,
  depth: 350,
  type: 'bedroom',
});

const furniture = ref<PlacedFurniture[]>([]);
const cart = ref<string[]>([]);

// --- Computed ---
const cartCount = computed(() => cart.value.length);

// Get unique furniture items for the Legend
const uniqueFurniture = computed(() => {
  return Array.from(
    new Map(furniture.value.map(f => [f.id, f])).values(),
  );
});

// --- Actions ---
const submitConfig = () => {
  // Clamp values
  const clamped: RoomConfig = {
    ...config.value,
    width: Math.max(150, Math.min(800, config.value.width)),
    depth: Math.max(150, Math.min(800, config.value.depth)),
  };

  config.value = clamped;
  furniture.value = generateLayout(clamped);
  cart.value = []; // Reset cart on new layout
};

const addToCart = (id: string) => {
  if (!cart.value.includes(id)) {
    cart.value.push(id);
  }
};

const removeFromCart = (id: string) => {
  cart.value = cart.value.filter(cid => cid !== id);
};
</script>

<template>
  <main class="flex-1 mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">
        Room Layout Planner
      </h1>
      <p class="mt-1 text-sm">
        Configure your room dimensions, choose a type, and let our engine
        generate an optimized furniture layout for you.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[280px_1fr_300px]">
      <aside class="order-1 lg:order-0">
        <RoomConfigurator
          v-model="config"
          @submit="submitConfig"
        />

        <UCard
          v-if="true || furniture.length > 0"
          class="mt-4"
          :ui="{ header: 'border-0 pb-0', body: 'grid gap-2' }"
        >
          <template
            #header
          >
            Legend
          </template>
          <div
            v-for="item in uniqueFurniture"
            :key="item.id"
            class="flex items-center gap-2"
          >
            <div
              class="w-3 h-3 rounded-sm"
              :style="{ backgroundColor: item.color }"
              aria-hidden="true"
            />
            <span class="text-xs text-foreground">
              {{ item.name }}
            </span>
          </div>
        </UCard>
      </aside>

      <section class="order-3 lg:order-0">
        <RoomCanvas
          :config="config"
          :furniture="furniture"
        />
      </section>

      <aside class="order-2 lg:order-0">
        <ProductSidebar
          :furniture="furniture"
          :cart="cart"
          @add-to-cart="addToCart"
          @remove-from-cart="removeFromCart"
        />
      </aside>
    </div>
  </main>
</template>
