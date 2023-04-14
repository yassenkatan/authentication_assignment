export const Order = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type Order = (typeof Order)[keyof typeof Order];
