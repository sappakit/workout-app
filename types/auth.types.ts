import { UserProfile } from "./user/response/user.types";

export interface SignUpRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Role {
  code: string;
  name: string;
}

export interface UserAuth {
  id: number;
  username: string;
  email: string;
  profile?: UserProfile | null;
  role?: Role;
}
