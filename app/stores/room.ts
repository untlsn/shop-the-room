const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living-room', label: 'Living Room' },
];

export const useRoomStore = defineStore('furniture', () => {
  const config = ref<RoomConfig>({
    width: 400,
    depth: 350,
    type: 'bedroom',
  });

  const furnitures = computed(() => furnitureSelector(config.value));

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
      cartStore.clear();
    },
  };
});
