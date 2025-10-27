/**
 * Tipos de domínio de Endereços
 */

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  primary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressInput {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  primary?: boolean;
}
