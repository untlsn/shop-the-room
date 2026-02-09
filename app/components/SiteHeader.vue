<script setup lang="ts">
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

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="relative flex items-center justify-center w-9 h-9 rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          :aria-label="`Cart with ${cartCount} items`"
        >
          <UIcon
            name="lucide:shopping-cart"
            class="size-4"
          />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1.5 -right-1.5 flex items-center justify-center size-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
          >
            {{ cartCount }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>
