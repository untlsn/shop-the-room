<script setup lang="ts">
// Props definition
const props = defineProps<{
  config: RoomConfig;
  furniture: PlacedFurniture[];
}>();

// Constants & State
const ROOM_TYPE_LABELS: Record<string, string> = {
  'bedroom': 'Bedroom',
  'living-room': 'Living Room',
  'office': 'Office',
};

const hoveredId = ref<string | null>(null);
const padding = 60;

// Computed values for SVG sizing
const svgWidth = computed(() => props.config.width + padding * 2);
const svgHeight = computed(() => props.config.depth + padding * 2);

const roomLabel = computed(() => ROOM_TYPE_LABELS[props.config.type] || props.config.type);
</script>

<template>
  <UCard :ui="{ header: 'flex justify-between items-center' }">
    <template #header>
      <h2 class="text-sm font-semibold uppercase tracking-widest text-foreground">
        Floor Plan
      </h2>
      <span class="text-xs text-muted-foreground font-mono">
        {{ config.width }} x {{ config.depth }} cm &middot; {{ roomLabel }}
      </span>
    </template>

    <svg
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      class="w-full h-auto"
      role="img"
      :aria-label="`Top-down floor plan of ${roomLabel}, ${config.width}cm by ${config.depth}cm`"
    >
      <defs>
        <pattern
          id="grid"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 50 0 L 0 0 0 50"
            fill="none"
            stroke="hsl(30 10% 80%)"
            stroke-width="0.5"
          />
        </pattern>
        <pattern
          id="grid-major"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke="hsl(30 10% 72%)"
            stroke-width="0.8"
          />
        </pattern>
      </defs>

      <rect
        :x="padding"
        :y="padding"
        :width="config.width"
        :height="config.depth"
        fill="hsl(40 25% 95%)"
      />
      <rect
        :x="padding"
        :y="padding"
        :width="config.width"
        :height="config.depth"
        fill="url(#grid)"
      />
      <rect
        :x="padding"
        :y="padding"
        :width="config.width"
        :height="config.depth"
        fill="url(#grid-major)"
      />

      <rect
        :x="padding"
        :y="padding"
        :width="config.width"
        :height="config.depth"
        fill="none"
        stroke="hsl(30 10% 20%)"
        stroke-width="3"
      />

      <g>
        <line
          :x1="padding"
          :y1="padding - 25"
          :x2="padding + config.width"
          :y2="padding - 25"
          stroke="hsl(30 10% 55%)"
          stroke-width="0.8"
        />
        <text
          :x="padding + config.width / 2"
          :y="padding - 30"
          text-anchor="middle"
          font-size="11"
          fill="hsl(30 10% 40%)"
          font-family="monospace"
        >
          {{ config.width }} cm
        </text>

        <line
          :x1="padding - 25"
          :y1="padding"
          :x2="padding - 25"
          :y2="padding + config.depth"
          stroke="hsl(30 10% 55%)"
          stroke-width="0.8"
        />
        <text
          :x="padding - 30"
          :y="padding + config.depth / 2"
          text-anchor="middle"
          font-size="11"
          fill="hsl(30 10% 40%)"
          font-family="monospace"
          :transform="`rotate(-90, ${padding - 30}, ${padding + config.depth / 2})`"
        >
          {{ config.depth }} cm
        </text>
      </g>

      <g
        v-for="(item, index) in furniture"
        :key="`${item.id}-${index}`"
        :transform="`translate(${padding + item.x}, ${padding + item.y})`"
        class="cursor-pointer"
        role="graphics-symbol"
        :aria-label="`${item.name}: ${item.widthCm}cm x ${item.depthCm}cm`"
        @mouseenter="hoveredId = `${item.id}-${index}`"
        @mouseleave="hoveredId = null"
      >
        <rect
          :width="item.widthCm"
          :height="item.depthCm"
          rx="3"
          :fill="item.color"
          :fill-opacity="hoveredId === `${item.id}-${index}` ? 0.95 : 0.8"
          :stroke="hoveredId === `${item.id}-${index}` ? 'hsl(30 10% 15%)' : 'hsl(30 10% 30%)'"
          :stroke-width="hoveredId === `${item.id}-${index}` ? 2 : 1"
        />
        <text
          :x="item.widthCm / 2"
          :y="item.depthCm / 2 - 5"
          text-anchor="middle"
          dominant-baseline="middle"
          :font-size="Math.min(12, item.widthCm / 8)"
          font-weight="600"
          fill="white"
          style="text-shadow: 0 1px 2px rgba(0,0,0,0.4)"
        >
          {{ item.label }}
        </text>
        <text
          :x="item.widthCm / 2"
          :y="item.depthCm / 2 + 10"
          text-anchor="middle"
          dominant-baseline="middle"
          :font-size="Math.min(9, item.widthCm / 10)"
          fill="rgba(255,255,255,0.9)"
          style="text-shadow: 0 1px 2px rgba(0,0,0,0.3)"
        >
          {{ item.widthCm }}x{{ item.depthCm }}
        </text>
      </g>

      <text
        v-if="furniture.length === 0"
        :x="svgWidth / 2"
        :y="svgHeight / 2"
        text-anchor="middle"
        font-size="14"
        fill="hsl(30 10% 55%)"
        font-family="sans-serif"
      >
        Configure your room and click "Generate Layout"
      </text>
    </svg>
  </UCard>
</template>
