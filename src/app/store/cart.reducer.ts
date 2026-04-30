import { createReducer, on } from '@ngrx/store';
import { CartState, PokemonDetail } from '../utils/interface';
import { addToCart, removeFromCart, clearCart, openCart, closeCart } from './cart.actions';

// Nilai awal
export const initialCartState: CartState = {
  items: [],
  isOpen: false,
};

export const cartReducer = createReducer(
  initialCartState,

  on(addToCart, (state, { pokemon }) => {
    const alreadyInCart = state.items.some(p => p.id === pokemon.id);
    if (alreadyInCart) return state;  // state tidak berubah jika sudah ada
    return { ...state, items: [...state.items, pokemon] };
  }),

  // removeFromCart: filter out Pokemon dengan id yang cocok
  on(removeFromCart, (state, { pokemonId }) => ({
    ...state,
    items: state.items.filter(p => p.id !== pokemonId)
  })),

  // clearCart: kosongkan semua item
  on(clearCart, (state) => ({
    ...state,
    items: []
  })),

  // openCart / closeCart: toggle panel
  on(openCart,  (state) => ({ ...state, isOpen: true  })),
  on(closeCart, (state) => ({ ...state, isOpen: false })),
);
