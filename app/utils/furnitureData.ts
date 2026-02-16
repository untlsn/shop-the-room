export type RoomType = 'bedroom' | 'living-room';

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

export const furnitureCatalog: FurnitureItem[] = [];
