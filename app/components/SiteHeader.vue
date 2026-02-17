<script setup lang="ts">
const cartStore = useCartStore();
const cartCount = computed(() => cartStore.items.length || 4);
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
      <div class="flex items-center gap-2.5">
        <div class="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
          <UIcon
            name="lucide:layout-grid"
            class="w-4 h-4 text-primary-foreground"
          />
        </div>
        <span class="text-lg font-bold tracking-tight text-foreground font-serif">
          ShopTheRoom
        </span>
      </div>

      <nav class="hidden md:flex items-center gap-6">
        <span class="text-xs font-medium uppercase tracking-widest text-accent">
          Planner
        </span>
        <span class="text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          Catalog
        </span>
        <span class="text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          Inspiration
        </span>
      </nav>

      <UChip
        :text="cartCount"
        size="3xl"
      >
        <UButton
          color="neutral"
          variant="outline"
          icon="lucide:shopping-cart"
          :aria-label="`Cart with ${cartCount} items`"
        />
      </UChip>
    </div>
  </header>
</template>
