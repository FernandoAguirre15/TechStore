export type Availability = "DISPONIBLE" | "AGOTADO" | "PROXIMAMENTE";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  availability: Availability;
}

export interface ProductInput {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  availability: Availability;
}

export interface ProductPage {
  content: Product[];
  number: number; // current page, 0-indexed
  totalPages: number;
  totalElements: number;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
}
