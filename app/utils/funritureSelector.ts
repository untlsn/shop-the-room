import * as THREE from 'three';

type FurnitureStaticData = {
  id: string;
  name: string;
  size: THREE.Vector3;
  price: number;
  modelSource: string;
};

export const furnitureStaticDataRecord = {
  /* Bedroom */
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

  /* Living Room */
  largeSofa: {
    id: 'largeSofa',
    name: 'Large Sofa',
    size: new THREE.Vector3(2.2, 0.9, 0.9),
    price: 899,
    modelSource: '/models/large-sofa.glb',
  },
  smallSofa: {
    id: 'smallSofa',
    name: 'Small Sofa',
    size: new THREE.Vector3(0.9, 0.9, 1.5),
    price: 599,
    modelSource: '/models/small-sofa.glb',
  },
  coffeeTable: {
    id: 'coffeeTable',
    name: 'Coffee Table',
    size: new THREE.Vector3(1, 0.4, 0.6),
    price: 199,
    modelSource: '/models/coffee-table.glb',
  },
  tvStand: {
    id: 'tvStand',
    name: 'TV Media Unit',
    size: new THREE.Vector3(1.6, 0.5, 0.4),
    price: 349,
    modelSource: '/models/tv-stand.glb',
  },
  bookshelf: {
    id: 'bookshelf',
    name: 'Bookshelf',
    size: new THREE.Vector3(0.8, 1.8, 0.3),
    price: 249,
    modelSource: '/models/bookshelf.glb',
  },
} satisfies Record<string, FurnitureStaticData>;

export function furnitureSelector(room: THREE.Vector2, roomType: RoomType): FurnitureComputedData[] {
  if (roomType == 'living-room') {
    if (room.x >= 3 && room.y >= 3) return decisions.grandLivingRoom(room);
    return decisions.standardLivingRoom(room);
  }

  if (room.x >= 3 && room.y >= 3) return decisions.bigestBedroom(room);
  return decisions.tinyRoom(room);
}

interface FurnitureComputedData extends FurnitureStaticData {
  position: THREE.Vector3;
  rotation?: THREE.Euler;
}

export const decisions = {
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

  grandLivingRoom(room: THREE.Vector2) {
    const { largeSofa, coffeeTable, tvStand, bookshelf } = furnitureStaticDataRecord;
    return [
      { ...largeSofa, position: new THREE.Vector3(0, largeSofa.size.y / 2, -(room.y / 2) + (largeSofa.size.z / 2)) },
      { ...coffeeTable, position: new THREE.Vector3(0, 0, -(room.y / 2) + 1.5) },
      {
        ...tvStand,
        position: new THREE.Vector3(0, 0, (room.y / 2) - (tvStand.size.z / 2)),
        rotation: new THREE.Euler(0, Math.PI, 0),
      },
      {
        ...bookshelf,
        position: new THREE.Vector3(
          -(room.x / 2) + (bookshelf.size.x / 2),
          bookshelf.size.y / 2,
          (room.y / 2) - (bookshelf.size.z / 2),
        ),
        rotation: new THREE.Euler(0, Math.PI, 0),
      },
    ];
  },

  standardLivingRoom(room: THREE.Vector2) {
    const { smallSofa, tvStand } = furnitureStaticDataRecord;
    return [
      {
        ...smallSofa,
        position: new THREE.Vector3(0, 0, -(room.y / 2) + (smallSofa.size.z / 4) + 0.1),
        rotation: new THREE.Euler(0, Math.PI / 2, 0),
      },
      {
        ...tvStand,
        position: new THREE.Vector3(0, 0, (room.y / 2) - (tvStand.size.z / 2)),
        rotation: new THREE.Euler(0, Math.PI, 0),
      },
    ];
  },
} satisfies Record<string, (room: THREE.Vector2) => FurnitureComputedData[]>;
