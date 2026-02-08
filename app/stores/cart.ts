export const useCartStore = defineStore('cart', () => {
  const items = ref<string[]>([]);

  return {
    items,

    empty: computed(() => items.value.length === 0),

    add: (id: string) => {
      if (!items.value.includes(id)) {
        items.value.push(id);
      }
    },
    remove: (id: string) => {
      items.value = items.value.filter(cid => cid !== id);
    },
    clear: () => {
      items.value = [];
    },
  };
});
