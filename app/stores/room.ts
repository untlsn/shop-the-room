const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living-room', label: 'Living Room' },
  { value: 'office', label: 'Office' },
];

export const useRoomStore = defineStore('furniture', () => {
  const furnitures = ref<PlacedFurniture[]>([]);
  const config = ref<RoomConfig>({
    width: 400,
    depth: 350,
    type: 'bedroom',
  });

  const cartStore = useCartStore();

  return {
    TYPES: ROOM_TYPES,

    furnitures,
    config,

    uniqueFurnitures: computed(() => {
      return new Map(furnitures.value.map(x => [x.id, x])).values().toArray();
    }),
    empty: computed(() => furnitures.value.length === 0),

    generate(values: RoomConfig) {
      config.value = values;
      furnitures.value = generateLayout(config.value);
      cartStore.clear();
    },
  };
});
