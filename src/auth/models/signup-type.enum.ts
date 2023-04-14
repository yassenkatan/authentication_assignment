export const SignupType = {
  PhoneNumber: 'PhoneNumber',
  Email: 'Email',
};

export type SignupType = (typeof SignupType)[keyof typeof SignupType];
