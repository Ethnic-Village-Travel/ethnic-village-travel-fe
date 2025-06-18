export interface Personal {
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface User {
  id: number;
  email: string;
  avatar?: string;
  personal?: Personal;
}
