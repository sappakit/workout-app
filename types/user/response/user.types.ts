export interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  imageUrl?: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile?: UserProfile | null;
}
