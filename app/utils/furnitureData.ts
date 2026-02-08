export type RoomType = 'bedroom' | 'living-room' | 'office';

export interface FurnitureItem {
  id: string;
  name: string;
  widthCm: number;
  depthCm: number;
  price: number;
  color: string;
  label: string;
  category: RoomType;
}

export interface PlacedFurniture extends FurnitureItem {
  x: number;
  y: number;
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
    widthCm: 200,
    depthCm: 210,
    price: 1299,
    color: '#a0856e',
    label: 'King Bed',
    category: 'bedroom',
  },
  {
    id: 'single-bed',
    name: 'Single Bed',
    widthCm: 100,
    depthCm: 200,
    price: 499,
    color: '#a0856e',
    label: 'Single Bed',
    category: 'bedroom',
  },
  {
    id: 'bedside-table',
    name: 'Bedside Table',
    widthCm: 50,
    depthCm: 45,
    price: 149,
    color: '#c9b99a',
    label: 'Nightstand',
    category: 'bedroom',
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    widthCm: 120,
    depthCm: 60,
    price: 799,
    color: '#8b7355',
    label: 'Wardrobe',
    category: 'bedroom',
  },
  {
    id: 'dresser',
    name: 'Dresser',
    widthCm: 100,
    depthCm: 50,
    price: 549,
    color: '#b09070',
    label: 'Dresser',
    category: 'bedroom',
  },

  // Living Room
  {
    id: 'sofa-3seat',
    name: '3-Seat Sofa',
    widthCm: 220,
    depthCm: 95,
    price: 1899,
    color: '#8b8b8b',
    label: 'Sofa',
    category: 'living-room',
  },
  {
    id: 'coffee-table',
    name: 'Coffee Table',
    widthCm: 120,
    depthCm: 60,
    price: 399,
    color: '#c9b99a',
    label: 'Coffee Table',
    category: 'living-room',
  },
  {
    id: 'tv-stand',
    name: 'TV Console',
    widthCm: 180,
    depthCm: 45,
    price: 699,
    color: '#6b5b4a',
    label: 'TV Console',
    category: 'living-room',
  },
  {
    id: 'armchair',
    name: 'Armchair',
    widthCm: 85,
    depthCm: 85,
    price: 649,
    color: '#9b9080',
    label: 'Armchair',
    category: 'living-room',
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    widthCm: 90,
    depthCm: 35,
    price: 349,
    color: '#8b7355',
    label: 'Bookshelf',
    category: 'living-room',
  },

  // Office
  {
    id: 'desk',
    name: 'Office Desk',
    widthCm: 160,
    depthCm: 80,
    price: 599,
    color: '#c9b99a',
    label: 'Desk',
    category: 'office',
  },
  {
    id: 'office-chair',
    name: 'Ergonomic Chair',
    widthCm: 65,
    depthCm: 65,
    price: 449,
    color: '#4a4a4a',
    label: 'Chair',
    category: 'office',
  },
  {
    id: 'filing-cabinet',
    name: 'Filing Cabinet',
    widthCm: 50,
    depthCm: 60,
    price: 279,
    color: '#8b8b8b',
    label: 'Cabinet',
    category: 'office',
  },
  {
    id: 'office-bookshelf',
    name: 'Office Bookshelf',
    widthCm: 80,
    depthCm: 35,
    price: 329,
    color: '#8b7355',
    label: 'Bookshelf',
    category: 'office',
  },
];
