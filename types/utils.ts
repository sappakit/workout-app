export type DistributiveOmit<T, TKey extends PropertyKey> = T extends unknown
  ? Omit<T, TKey>
  : never;
