function findItem(id: string) {
  return furnitureCatalog.find(f => f.id === id)!;
}

function place(
  id: string,
  x: number,
  y: number,
  rotation = 0,
): PlacedFurniture {
  const item = findItem(id);
  return { ...item, x, y, rotation };
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
  if (width > 300) {
    // King bed centred
    const bed = findItem('king-bed');
    const bedX = (width - bed.widthCm) / 2;
    const bedY = depth - bed.depthCm - gap;
    items.push(place('king-bed', bedX, bedY));

    // Bedside tables flanking
    const table = findItem('bedside-table');
    const leftTableX = bedX - table.widthCm - 10;
    if (leftTableX >= gap) {
      items.push(place('bedside-table', leftTableX, bedY + (bed.depthCm - table.depthCm)));
    }
    const rightTableX = bedX + bed.widthCm + 10;
    if (rightTableX + table.widthCm <= width - gap) {
      items.push(place('bedside-table', rightTableX, bedY + (bed.depthCm - table.depthCm)));
    }

    // Wardrobe on the opposite wall if space allows
    const wardrobe = findItem('wardrobe');
    if (width >= wardrobe.widthCm + gap * 2) {
      items.push(place('wardrobe', gap, gap));
    }

    // Dresser if there's room next to wardrobe
    const dresser = findItem('dresser');
    const dresserX = gap + wardrobe.widthCm + 20;
    if (dresserX + dresser.widthCm <= width - gap) {
      items.push(place('dresser', dresserX, gap));
    }
  } else {
    // Single bed against left wall
    const bed = findItem('single-bed');
    items.push(place('single-bed', gap, depth - bed.depthCm - gap));

    // One bedside table beside bed
    const table = findItem('bedside-table');
    const tableX = gap + bed.widthCm + 10;
    if (tableX + table.widthCm <= width - gap) {
      items.push(
        place(
          'bedside-table',
          tableX,
          depth - table.depthCm - gap,
        ),
      );
    }

    // Wardrobe on opposite wall
    const wardrobe = findItem('wardrobe');
    if (width >= wardrobe.widthCm + gap * 2) {
      items.push(place('wardrobe', width - wardrobe.widthCm - gap, gap));
    }
  }

  return items;
}

function generateLivingRoomLayout(
  width: number,
  depth: number,
  items: PlacedFurniture[],
  gap: number,
): PlacedFurniture[] {
  // TV Console against top wall
  const tvStand = findItem('tv-stand');
  const tvX = (width - tvStand.widthCm) / 2;
  items.push(place('tv-stand', tvX, gap));

  // Sofa facing TV
  const sofa = findItem('sofa-3seat');
  const sofaX = (width - sofa.widthCm) / 2;
  const sofaY = depth - sofa.depthCm - gap;
  items.push(place('sofa-3seat', sofaX, sofaY));

  // Coffee table between sofa and TV
  const coffeeTable = findItem('coffee-table');
  const ctX = (width - coffeeTable.widthCm) / 2;
  const ctY = sofaY - coffeeTable.depthCm - 40;
  if (ctY > tvStand.depthCm + gap + 20) {
    items.push(place('coffee-table', ctX, ctY));
  }

  // Armchair to the side if room allows
  const armchair = findItem('armchair');
  if (sofaX - armchair.widthCm - 20 >= gap) {
    items.push(
      place('armchair', gap, sofaY + (sofa.depthCm - armchair.depthCm)),
    );
  }

  // Bookshelf on side wall
  const bookshelf = findItem('bookshelf');
  if (width >= sofa.widthCm + armchair.widthCm + bookshelf.widthCm + 60) {
    items.push(
      place('bookshelf', width - bookshelf.widthCm - gap, gap),
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
  const deskX = (width - desk.widthCm) / 2;
  items.push(place('desk', deskX, gap));

  // Chair in front of desk
  const chair = findItem('office-chair');
  const chairX = deskX + (desk.widthCm - chair.widthCm) / 2;
  const chairY = gap + desk.depthCm + 20;
  items.push(place('office-chair', chairX, chairY));

  // Filing cabinet beside desk
  const cabinet = findItem('filing-cabinet');
  const cabX = deskX - cabinet.widthCm - 15;
  if (cabX >= gap) {
    items.push(place('filing-cabinet', cabX, gap));
  }

  // Bookshelf on opposite wall
  const bookshelf = findItem('office-bookshelf');
  items.push(
    place('office-bookshelf', width - bookshelf.widthCm - gap, gap),
  );

  return items;
}
