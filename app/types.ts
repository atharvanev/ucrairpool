// src/types.ts

export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    numbers: string;
  }
  
  export interface ErrorResponse {
    error: string;
  }
  
  export type GetUserResponse = UserProfile | ErrorResponse;