import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PokemonDetail } from '../../../utils/interface';
import { selectCartItems, selectCartCount, selectCartIsOpen } from '../../../store/cart.selectors';
import { removeFromCart, clearCart, closeCart } from '../../../store/cart.actions';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  items$: Observable<PokemonDetail[]>;
  count$: Observable<number>;
  isOpen$: Observable<boolean>;

  private typeColors: { [key: string]: string } = {
    fire: '#FF6B35', water: '#4FC3F7', grass: '#66BB6A',
    electric: '#FFCA28', psychic: '#EC407A', ice: '#80DEEA',
    dragon: '#7B1FA2', dark: '#4E342E', fairy: '#F48FB1',
    normal: '#9E9E9E', fighting: '#D32F2F', flying: '#7986CB',
    poison: '#AB47BC', ground: '#FFCC02', rock: '#8D6E63',
    bug: '#8BC34A', ghost: '#5C6BC0', steel: '#78909C',
  };

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.items$  = this.store.select(selectCartItems);
    this.count$  = this.store.select(selectCartCount);
    this.isOpen$ = this.store.select(selectCartIsOpen);
  }

  remove(pokemonId: number) {
    this.store.dispatch(removeFromCart({ pokemonId }));
  }

  clear() {
    this.store.dispatch(clearCart());
  }

  close() {
    this.store.dispatch(closeCart());
  }

  goToDetail(pokemon: PokemonDetail) {
    this.store.dispatch(closeCart());
    this.router.navigate(['/pokemon/detail', pokemon.id]);
  }

  getTypeColor(type: string): string {
    return this.typeColors[type] || '#9E9E9E';
  }
}
