import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonDetail } from '../../../utils/interface';

@Component({
  selector: 'app-card',
  standalone: false,
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() pokemon: PokemonDetail = { id: 0, name: '', url: '', types: [], height: 0, weight: 0 };
  @Input() isFavorite: boolean = false;
  @Input() isHide: boolean = false;
  @Input() showDetailButton: boolean = false;

  @Output() addToFavorites = new EventEmitter<PokemonDetail>();
  @Output() removeFromFavorites = new EventEmitter<PokemonDetail>();
  @Output() navigateToDetail = new EventEmitter<PokemonDetail>();

  private typeColors: { [key: string]: string } = {
    fire: '#FF6B35', water: '#4FC3F7', grass: '#66BB6A',
    electric: '#FFCA28', psychic: '#EC407A', ice: '#80DEEA',
    dragon: '#7B1FA2', dark: '#4E342E', fairy: '#F48FB1',
    normal: '#9E9E9E', fighting: '#D32F2F', flying: '#7986CB',
    poison: '#AB47BC', ground: '#FFCC02', rock: '#8D6E63',
    bug: '#8BC34A', ghost: '#5C6BC0', steel: '#78909C',
  };

  // Buat gradient card berdasarkan tipe utama Pokemon
  getCardGradient(): string {
    const color = this.typeColors[this.pokemon.types?.[0]] || '#9E9E9E';
    return `linear-gradient(160deg, ${color}99, ${color}44)`;
  }

  toogleFavorite() {
    if (this.isFavorite) {
      this.removeFromFavorites.emit(this.pokemon);
    } else {
      this.addToFavorites.emit(this.pokemon);
    }
  }

  onNavigateToDetail() {
    this.navigateToDetail.emit(this.pokemon);
  }
}
