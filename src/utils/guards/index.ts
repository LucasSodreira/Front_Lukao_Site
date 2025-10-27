/**
 * Type guards para verificação de tipos em runtime
 */

import type { User, Product, Cart, Order } from '@/types';

export const isUser = (value: unknown): value is User => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'name' in value
  );
};

export const isProduct = (value: unknown): value is Product => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'price' in value
  );
};

export const isCart = (value: unknown): value is Cart => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'items' in value &&
    Array.isArray((value as Cart).items)
  );
};

export const isOrder = (value: unknown): value is Order => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'status' in value &&
    'items' in value
  );
};

export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};
