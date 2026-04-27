import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PokemonService } from '../../../services/pokemon.service';
import { Pokemon, PokemonDetail } from '../../../utils/interface';

@Component({
  selector: 'app-pokemon-favorites',
  standalone: false,
  templateUrl: './pokemon-favorites.component.html',
  styleUrl: './pokemon-favorites.component.css',
})
export class PokemonFavoritesComponent {
  isLoading: boolean = false;

  favorites: PokemonDetail[] = [];
  listPokemonDetail: PokemonDetail[] = [];

  listAllPokemon: PokemonDetail[] = [];

  constructor(
    private pokemonService: PokemonService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPokemon();
      const storedFavorites = localStorage.getItem('pokemonFavorites');
      if (storedFavorites) {
        this.favorites = JSON.parse(storedFavorites);
      }
    }
  }

  async loadPokemon(): Promise<void> {
    try {
      this.isLoading = true;

      const response = await this.pokemonService.getPokemonList();

      this.listAllPokemon = await Promise.all(
        response.map(async (pokemon: Pokemon) => {
          const detail = await this.pokemonService.getPokemonDetails(
            pokemon.url,
          );
          return {
            id: detail.id,
            name: detail.name,
            url: pokemon.url,
            image: detail.sprites.front_default,
            types: detail.types.map((type: any) => type.type.name),
            height: detail.height,
            weight: detail.weight,
          };
        }),
      );
      console.log('Fetched Pokemon Data:', this.listAllPokemon);
    } catch (error) {
      console.log('Error', error);
    } finally {
      this.isLoading = false;
    }
  }

  addToFavorites(pokemon: PokemonDetail) {
    if (!this.favorites.some((p) => p.id === pokemon.id)) {
      this.favorites.push(pokemon);
      this.syncFavorite();
    }
  }

  removeFromFavorites(pokemon: PokemonDetail) {
    this.favorites = this.favorites.filter((p) => p.id !== pokemon.id);
    this.syncFavorite();
  }

  syncFavorite(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('pokemonFavorites', JSON.stringify(this.favorites));
    }
  }

  isFavorite(pokemon: PokemonDetail): boolean {
    return this.favorites.some((fav) => fav.name === pokemon.name);
  }
}
