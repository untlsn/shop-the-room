function findItem(id: string) {
  return furnitureCatalog.find(f => f.id === id)!;
}

function place(
  id: string,
  x: number,
  z: number,
  rotation = 0,
): PlacedFurniture {
  const item = findItem(id);
  return { ...item, x, z: z, rotation };
}

export function generateLayout(config: RoomConfig): PlacedFurniture[] {
  const { width, depth, type } = config;
  const items: PlacedFurniture[] = [];
  const WALL_GAP = 10;

  if (type === 'bedroom') {
    return generateBedroomLayout(width, depth, items, WALL_GAP);
  }

  if (type === 'living-room') {
    return generateLivingRoomLayout(width, depth, items, WALL_GAP);
  }

  if (type === 'office') {
    return generateOfficeLayout(width, depth, items, WALL_GAP);
  }

  return items;
}

function generateBedroomLayout(
  width: number,
  depth: number,
  items: PlacedFurniture[],
  gap: number,
): PlacedFurniture[] {
  // Check both width AND depth for King layout
  if (width > 300 && depth >= 300) {
    // --- King Bed Layout (Unchanged) ---
    const bed = findItem('king-bed');
    const bedX = (width - bed.width) / 2;
    const bedY = depth - bed.depth - gap;
    items.push(place('king-bed', bedX, bedY));

    const table = findItem('bedside-table');
    const leftTableX = bedX - table.width - 10;
    if (leftTableX >= gap) {
      items.push(place('bedside-table', leftTableX, bedY + (bed.depth - table.depth)));
    }
    const rightTableX = bedX + bed.width + 10;
    if (rightTableX + table.width <= width - gap) {
      items.push(place('bedside-table', rightTableX, bedY + (bed.depth - table.depth)));
    }

    const wardrobe = findItem('wardrobe');
    if (width >= wardrobe.width + gap * 2) {
      items.push(place('wardrobe', gap, gap));
    }

    const dresser = findItem('dresser');
    const dresserX = gap + wardrobe.width + 20;
    if (dresserX + dresser.width <= width - gap) {
      items.push(place('dresser', dresserX, gap));
    }
  } else {
    // --- Single Bed Layout ---

    // Single bed against left wall
    const bed = findItem('single-bed');
    items.push(place('single-bed', gap, depth - bed.depth - gap));

    // One bedside table beside bed
    const table = findItem('bedside-table');
    const tableX = gap + bed.width + 10;
    if (tableX + table.width <= width - gap) {
      items.push(
        place('bedside-table', tableX, depth - table.depth - gap),
      );
    }

    // Wardrobe on opposite wall (Right side)
    const wardrobe = findItem('wardrobe');
    let wardrobePlaced = false;
    const wardrobeX = width - wardrobe.width - gap;

    if (width >= wardrobe.width + gap * 2) {
      items.push(place('wardrobe', wardrobeX, gap));
      wardrobePlaced = true;
    }

    // UPDATE: Dresser placement logic
    const dresser = findItem('dresser');
    let dresserX;

    if (wardrobePlaced) {
      // If wardrobe exists, place dresser to its left with a 20cm gap
      dresserX = wardrobeX - 20 - dresser.width;
    } else {
      // If no wardrobe, place dresser against the right wall
      dresserX = width - dresser.width - gap;
    }

    // Ensure there is space (x > gap) before placing
    if (dresserX >= gap) {
      items.push(place('dresser', dresserX, gap));
    }
  }

  return items;
}

type Cords3D = [x: number, y: number, z: number];

export const decisions = {
  bigestBedroom(room: { depth: number; width: number }): { id: string; position: Cords3D; rotation: Cords3D; size: Cords3D }[] {
    const bed = findItem('king-bed');
    const table = findItem('bedside-table');
    const wardrobe = findItem('wardrobe');
    const dresser = findItem('dresser');

    return [
      {
        id: 'king-bed',
        // Centered on the back wall (-z)
        position: [0, bed.height / 2, -(room.depth / 2) + (bed.depth / 2)],
        rotation: [0, 0, 0], // Facing forward (+z)
        size: [bed.width, bed.height, bed.depth],
      },
      {
        id: 'bedside-table-left',
        // Pinned to the left side of the bed, against the back wall (-z)
        position: [-(bed.width / 2) - (table.width / 2), table.height / 2, -(room.depth / 2) + (table.depth / 2)],
        rotation: [0, 0, 0],
        size: [table.width, table.height, table.depth],
      },
      {
        id: 'bedside-table-right',
        // Pinned to the right side of the bed, against the back wall (-z)
        position: [(bed.width / 2) + (table.width / 2), table.height / 2, -(room.depth / 2) + (table.depth / 2)],
        rotation: [0, 0, 0],
        size: [table.width, table.height, table.depth],
      },
      {
        id: 'wardrobe',
        // Pinned to the front-left corner (+z, -x), rotated to face the bed
        position: [-(room.width / 2) + (wardrobe.width / 2), wardrobe.height / 2, (room.depth / 2) - (wardrobe.depth / 2)],
        rotation: [0, Math.PI, 0], // Rotated 180 degrees to face -z
        size: [wardrobe.width, wardrobe.height, wardrobe.depth],
      },
      {
        id: 'dresser',
        // Pinned to the front-right corner (+z, +x), rotated to face the bed
        position: [(room.width / 2) - (dresser.width / 2), dresser.height / 2, (room.depth / 2) - (dresser.depth / 2)],
        rotation: [0, Math.PI, 0], // Rotated 180 degrees to face -z
        size: [dresser.width, dresser.height, dresser.depth],
      },
    ];
  },
};

function generateLivingRoomLayout(
  width: number,
  depth: number,
  items: PlacedFurniture[],
  gap: number,
): PlacedFurniture[] {
  // TV Console against top wall
  const tvStand = findItem('tv-stand');
  const tvX = (width - tvStand.width) / 2;
  items.push(place('tv-stand', tvX, gap));

  // Sofa facing TV
  const sofa = findItem('sofa-3seat');
  const sofaX = (width - sofa.width) / 2;
  const sofaY = depth - sofa.depth - gap;
  items.push(place('sofa-3seat', sofaX, sofaY));

  // Coffee table between sofa and TV
  const coffeeTable = findItem('coffee-table');
  const ctX = (width - coffeeTable.width) / 2;
  const ctY = sofaY - coffeeTable.depth - 40;
  if (ctY > tvStand.depth + gap + 20) {
    items.push(place('coffee-table', ctX, ctY));
  }

  // Armchair to the side if room allows
  const armchair = findItem('armchair');
  if (sofaX - armchair.width - 20 >= gap) {
    items.push(
      place('armchair', gap, sofaY + (sofa.depth - armchair.depth)),
    );
  }

  // Bookshelf on side wall
  const bookshelf = findItem('bookshelf');
  if (width >= sofa.width + armchair.width + bookshelf.width + 60) {
    items.push(
      place('bookshelf', width - bookshelf.width - gap, gap),
    );
  }

  return items;
}

function generateOfficeLayout(
  width: number,
  depth: number,
  items: PlacedFurniture[],
  gap: number,
): PlacedFurniture[] {
  // Desk centred against the far wall
  const desk = findItem('desk');
  const deskX = (width - desk.width) / 2;
  items.push(place('desk', deskX, gap));

  // Chair in front of desk
  const chair = findItem('office-chair');
  const chairX = deskX + (desk.width - chair.width) / 2;
  const chairY = gap + desk.depth + 20;
  items.push(place('office-chair', chairX, chairY));

  // Filing cabinet beside desk
  const cabinet = findItem('filing-cabinet');
  const cabX = deskX - cabinet.width - 15;
  if (cabX >= gap) {
    items.push(place('filing-cabinet', cabX, gap));
  }

  // Bookshelf on opposite wall
  const bookshelf = findItem('office-bookshelf');
  items.push(
    place('office-bookshelf', width - bookshelf.width - gap, gap),
  );

  return items;
}
