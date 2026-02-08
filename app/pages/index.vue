<script setup lang="ts">

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
        <RoomConfigurator />
        <RoomLegend />
      </aside>

      <section class="order-3 lg:order-0">
        <RoomCanvas />
      </section>

      <aside class="order-2 lg:order-0">
        <ProductSidebar />
      </aside>
    </div>
  </main>
</template>
