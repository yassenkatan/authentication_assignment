export const UserRole = {
  Admin: 'Admin',
  User: 'User',
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
