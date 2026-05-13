export type SignUpRequest = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
};

type Role = {
  code: string;
  naame: string;
};

export type UserAuth = {
  id: number;
  username: string;
  email: string;
  role?: Role;
};
