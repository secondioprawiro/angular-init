import { createAction, props } from '@ngrx/store';
import { PokemonDetail } from '../utils/interface';

export const addToCart = createAction(
  '[Cart] Add Pokemon',
  props<{ pokemon: PokemonDetail }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Pokemon',
  props<{ pokemonId: number }>()
);

export const clearCart = createAction(
  '[Cart] Clear'
);

export const openCart = createAction(
  '[Cart] Open Panel'
);

export const closeCart = createAction(
  '[Cart] Close Panel'
);
