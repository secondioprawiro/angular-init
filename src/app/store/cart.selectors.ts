import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from '../utils/interface'

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items
);

export const selectCartCount = createSelector(
  selectCartItems,
  (items) => items.length
);

export const selectCartIsOpen = createSelector(
  selectCartState,
  (state) => state.isOpen
);
