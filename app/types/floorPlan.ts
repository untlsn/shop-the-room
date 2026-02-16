export type FurnitureItem = {
  type: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
};

export type RoomPlan = {
  width: number;
  depth: number;
  wallHeight: number;
  furniture: FurnitureItem[];
};
