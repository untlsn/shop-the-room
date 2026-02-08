<script setup lang="ts">
const cartStore = useCartStore();
const roomStore = useRoomStore();

const groupedEntries = computed(() => {
  const grouped = roomStore.furnitures.reduce(
    (acc, item) => {
      acc[item.id] ||= { item, count: 0 };
      acc[item.id]!.count++;
      return acc;
    },
    {} as Record<string, { item: PlacedFurniture; count: number }>,
  );
  return Object.values(grouped);
});

const totalPrice = computed(() =>
  groupedEntries.value.reduce((sum, { item, count }) => sum + item.price * count, 0),
);

const cartTotal = computed(() =>
  groupedEntries.value
    .filter(({ item }) => cartStore.items.includes(item.id))
    .reduce((sum, { item, count }) => sum + item.price * count, 0),
);
</script>

<template>
  <UCard :ui="{ header: 'flex justify-between items-center' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="lucide:package"
          class="w-4 h-4 text-muted-foreground"
        />
        <h2 class="text-sm font-semibold uppercase tracking-widest text-foreground">
          Products
        </h2>
      </div>
      <span class="text-xs text-muted-foreground">
        {{ groupedEntries.length }} item{{ groupedEntries.length !== 1 ? "s" : "" }}
      </span>
    </template>

    <div class="divide-y divide-border max-h-105 overflow-y-auto">
      <div
        v-if="groupedEntries.length === 0"
        class="px-4 py-10 text-center text-sm text-muted-foreground"
      >
        Generate a layout to see products
      </div>

      <div
        v-for="{ item, count } in groupedEntries"
        :key="item.id"
        class="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
      >
        <div
          class="w-10 h-10 rounded-md shrink-0"
          :style="{ backgroundColor: item.color }"
          aria-hidden="true"
        />

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-foreground truncate">
            {{ item.name }}
            <span
              v-if="count > 1"
              class="ml-1.5 text-xs text-muted-foreground"
            >
              x{{ count }}
            </span>
          </p>
          <p class="text-xs text-muted-foreground">
            {{ item.widthCm }} x {{ item.depthCm }} cm
          </p>
        </div>

        <div class="text-right shrink-0">
          <p class="text-sm font-semibold text-foreground tabular-nums">
            ${{ (item.price * count).toLocaleString() }}
          </p>
        </div>

        <button
          v-if="cartStore.items.includes(item.id)"
          type="button"
          class="flex items-center justify-center w-8 h-8 rounded-md bg-accent text-accent-foreground transition-colors hover:bg-accent/80 shrink-0"
          :aria-label="`Remove ${item.name} from cart`"
          @click="cartStore.remove(item.id)"
        >
          <UIcon
            name="lucide:check"
            class="w-4 h-4"
          />
        </button>
        <button
          v-else
          type="button"
          class="flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground shrink-0"
          :aria-label="`Add ${item.name} to cart`"
          @click="cartStore.add(item.id)"
        >
          <UIcon
            name="lucide:plus"
            class="w-4 h-4"
          />
        </button>
      </div>
    </div>

    <template
      v-if="groupedEntries.length > 0"
      #footer
    >
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Layout Total
        </span>
        <span class="text-sm font-semibold text-foreground tabular-nums">
          ${{ totalPrice.toLocaleString() }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <span class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-accent">
          <UIcon
            name="lucide:shopping-cart"
            class="w-3 h-3"
          />
          Cart Total
        </span>
        <span class="text-sm font-semibold text-accent tabular-nums">
          ${{ cartTotal.toLocaleString() }}
        </span>
      </div>

      <UButton
        v-if="cartStore.empty"
        variant="outline"
        icon="lucide:trash-2"
        class="w-full flex justify-center"
        :ui="{ leadingIcon: 'size-3 mr-2' }"
        @click="cartStore.clear"
      >
        Clear Cart
      </UButton>
    </template>
  </UCard>
</template>
