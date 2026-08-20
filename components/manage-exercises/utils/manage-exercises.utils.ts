type OrderedItem = {
  orderIndex: number;
};

export function normalizeOrderIndex<TItem extends OrderedItem>(
  items: TItem[],
): TItem[] {
  return items.map((item, index) => ({
    ...item,
    orderIndex: index + 1,
  }));
}
