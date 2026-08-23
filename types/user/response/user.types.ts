export interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  imageUrl: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile?: UserProfile | null;
}
