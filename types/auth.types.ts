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

export type User = {
  id: number;
  username: string;
  email: string;
  role?: Role;
};
