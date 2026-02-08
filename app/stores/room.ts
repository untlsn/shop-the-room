export const useRoomStore = defineStore('furniture', () => {
  const furnitures = ref<PlacedFurniture[]>([]);
  const config = ref<RoomConfig>({
    width: 400,
    depth: 350,
    type: 'bedroom',
  });

  const cartStore = useCartStore();

  return {
    furnitures,
    config,

    uniqueFurnitures: computed(() => {
      return new Map(furnitures.value.map(x => [x.id, x])).values().toArray();
    }),
    empty: computed(() => furnitures.value.length === 0),

    generate() {
      furnitures.value = generateLayout(config.value);
      cartStore.clear();
    },
  };
});
