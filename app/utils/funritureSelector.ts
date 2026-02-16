import * as THREE from 'three';

type FurnitureStaticData = {
  id: string;
  name: string;
  size: THREE.Vector3;
  price: number;
  modelSource: string;
};

export const furnitureStaticDataRecord = {
  kingBed: {
    id: 'kingBed',
    name: 'King Size Bed',
    size: new THREE.Vector3(2, 0.8, 2.1),
    price: 1299,
    modelSource: '/models/king-bed.glb',
  },
  singleBed: {
    id: 'singleBed',
    name: 'Single Bed',
    size: new THREE.Vector3(0.9, 0.8, 2),
    price: 499,
    modelSource: '/models/single-bed.glb',
  },
  nightstand: {
    id: 'nightstand',
    name: 'Bedside Table',
    size: new THREE.Vector3(0.4, 0.5, 0.4),
    price: 149,
    modelSource: '/models/nightstand.glb',
  },
  wardrobe: {
    id: 'wardrobe',
    name: 'Wardrobe',
    size: new THREE.Vector3(1.2, 1.8, 0.6),
    price: 799,
    modelSource: '/models/wardrobe.glb',
  },
  dresser: {
    id: 'dresser',
    name: 'Dresser',
    size: new THREE.Vector3(1, 1.5, 0.5),
    price: 549,
    modelSource: '/models/dresser.glb',
  },
} satisfies Record<string, FurnitureStaticData>;

export function furnitureSelector(room: THREE.Vector2): FurnitureComputedData[] {
  if (room.x >= 3 && room.y >= 3) return decisions.bigestBedroom(room);
  return decisions.tinyRoom(room);
}

interface FurnitureComputedData extends FurnitureStaticData {
  position: THREE.Vector3;
  rotation?: THREE.Euler;
}

export const decisions = {
  // For rooms at least 300x300
  bigestBedroom(room) {
    const { kingBed, nightstand, wardrobe, dresser } = furnitureStaticDataRecord;

    return [
      {
        ...kingBed,
        position: new THREE.Vector3(0, 0, -(room.y / 2) + (kingBed.size.z / 2)),
      },
      {
        ...nightstand,
        position: new THREE.Vector3(
          -(kingBed.size.x / 2) - (nightstand.size.x / 2),
          0,
          -(room.y / 2) + (nightstand.size.z / 2),
        ),
      },
      {
        ...nightstand,
        position: new THREE.Vector3(
          (kingBed.size.x / 2) + (nightstand.size.x / 2),
          0,
          -(room.y / 2) + (nightstand.size.z / 2),
        ),
      },
      {
        ...wardrobe,
        position: new THREE.Vector3(
          -(room.x / 2) + (wardrobe.size.x / 2),
          0,
          (room.y / 2) - (wardrobe.size.z / 2),
        ),
      },
      {
        ...dresser,
        position: new THREE.Vector3(
          (room.x / 2) - (dresser.size.x / 2),
          0,
          (room.y / 2) - (dresser.size.z / 2),
        ),
      },
    ];
  },
  tinyRoom(room: THREE.Vector2) {
    const { singleBed, nightstand, dresser } = furnitureStaticDataRecord;
    return [
      {
        ...singleBed,
        position: new THREE.Vector3(-(room.x / 2) + (singleBed.size.x / 2), 0, -(room.y / 2) + (singleBed.size.z / 2)),
      },
      {
        ...nightstand,
        position: new THREE.Vector3(
          -(room.x / 2) + (nightstand.size.x / 2) + singleBed.size.x,
          0,
          -(room.y / 2) + (nightstand.size.z / 2),
        ),
      },
      {
        ...dresser,
        position: new THREE.Vector3((room.x / 2) - (dresser.size.x / 2), 0, (room.y / 2)),
        rotation: new THREE.Euler(0, Math.PI, 0),
      },
    ];
  },
} satisfies Record<string, (room: THREE.Vector2) => FurnitureComputedData[]>;
