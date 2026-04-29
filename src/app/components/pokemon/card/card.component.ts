import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonDetail } from '../../../utils/interface';

@Component({
  selector: 'app-card',
  standalone: false,
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() pokemon: PokemonDetail = {id: 0, name: '', url: '', types: [], height: 0, weight: 0};
  @Input() isFavorite: boolean = false;
  @Input() isHide: boolean = false;
  @Input() showDetailButton: boolean = false;

  @Output() addToFavorites = new EventEmitter<PokemonDetail>();
  @Output() removeFromFavorites = new EventEmitter<PokemonDetail>();
  @Output() navigateToDetail = new EventEmitter<PokemonDetail>();

  toogleFavorite(){
    if(this.isFavorite){
      this.removeFromFavorites.emit();
    } else {
      this.addToFavorites.emit();
    }
  }

  onNavigateToDetail(){
    this.navigateToDetail.emit(this.pokemon);
  }
}
