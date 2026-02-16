export type RoomType = 'bedroom' | 'living-room' | 'office';

export interface FurnitureItem {
  id: string;
  name: string;
  width: number;
  depth: number;
  height: number;
  price: number;
  color: string;
  label: string;
  category: RoomType;
  model: string;
}

export interface PlacedFurniture extends FurnitureItem {
  x: number;
  z: number;
  rotation: number;
}

export interface RoomConfig {
  width: number;
  depth: number;
  type: RoomType;
}

export const furnitureCatalog: FurnitureItem[] = [
  // Bedroom
  {
    id: 'king-bed',
    name: 'King Size Bed',
    width: 2,
    depth: 2.1,
    height: 0.8,
    price: 1299,
    color: '#a0856e',
    label: 'King Bed',
    category: 'bedroom',
    model: '/models/king-bed.glb',
  },
  {
    id: 'single-bed',
    name: 'Single Bed',
    width: 1,
    depth: 2,
    height: 1,
    price: 499,
    color: '#a0856e',
    label: 'Single Bed',
    category: 'bedroom',
  },
  {
    id: 'nightstand',
    name: 'Bedside Table',
    width: 0.4,
    depth: 0.4,
    height: 0.5,
    price: 149,
    color: '#c9b99a',
    label: 'Nightstand',
    category: 'bedroom',
    model: '/models/nightstand.glb',
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    width: 1.2,
    depth: 0.6,
    height: 1.8,
    price: 799,
    color: '#8b7355',
    label: 'Wardrobe',
    category: 'bedroom',
    model: '/models/wardrobe.glb',
  },
  {
    id: 'dresser',
    name: 'Dresser',
    width: 1,
    depth: 0.5,
    height: 1.5,
    price: 549,
    color: '#b09070',
    label: 'Dresser',
    category: 'bedroom',
    model: '/models/dresser.glb',
  },

  // Living Room
  {
    id: 'sofa-3-seat',
    name: '3-Seat Sofa',
    width: 2.2,
    depth: 0.95,
    height: 0.8,
    price: 1899,
    color: '#8b8b8b',
    label: 'Sofa',
    category: 'living-room',
  },
  {
    id: 'coffee-table',
    name: 'Coffee Table',
    width: 1.2,
    depth: 0.6,
    height: 0.45,
    price: 399,
    color: '#c9b99a',
    label: 'Coffee Table',
    category: 'living-room',
  },
  {
    id: 'tv-stand',
    name: 'TV Console',
    width: 1.8,
    depth: 0.45,
    height: 0.6,
    price: 699,
    color: '#6b5b4a',
    label: 'TV Console',
    category: 'living-room',
  },
  {
    id: 'armchair',
    name: 'Armchair',
    width: 0.85,
    depth: 0.85,
    height: 0.9,
    price: 649,
    color: '#9b9080',
    label: 'Armchair',
    category: 'living-room',
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    width: 0.9,
    depth: 0.35,
    height: 1.8,
    price: 349,
    color: '#8b7355',
    label: 'Bookshelf',
    category: 'living-room',
  },

  // Office
  {
    id: 'desk',
    name: 'Office Desk',
    width: 1.6,
    depth: 0.8,
    height: 0.75,
    price: 599,
    color: '#c9b99a',
    label: 'Desk',
    category: 'office',
  },
  {
    id: 'office-chair',
    name: 'Ergonomic chair',
    width: 0.65,
    depth: 0.65,
    height: 1.1,
    price: 449,
    color: '#4a4a4a',
    label: 'Chair',
    category: 'office',
  },
  {
    id: 'filing-cabinet',
    name: 'Filing Cabinet',
    width: 0.5,
    depth: 0.6,
    height: 1.2,
    price: 279,
    color: '#8b8b8b',
    label: 'Cabinet',
    category: 'office',
  },
  {
    id: 'office-bookshelf',
    name: 'Office Bookshelf',
    width: 0.8,
    depth: 0.35,
    height: 1.5,
    price: 329,
    color: '#8b7355',
    label: 'Bookshelf',
    category: 'office',
  },
];
