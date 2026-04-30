import { Component } from '@angular/core';
import { PokemonService } from '../../../services/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { PokemonDetail, EvolutionStage } from '../../../utils/interface';
import { addToCart, removeFromCart } from '../../../store/cart.actions';
import { selectCartItems } from '../../../store/cart.selectors';

@Component({
  selector: 'app-detail-pokemon',
  standalone: false,
  templateUrl: './detail-pokemon.component.html',
  styleUrl: './detail-pokemon.component.css'
})
export class DetailPokemonComponent {

  pokemon: PokemonDetail | null = null;
  statsLoaded = false;

  evolutionChain: EvolutionStage[] = [];
  isLoadingEvolution = false;

  // Pantau apakah Pokemon ini sudah ada di cart
  // Di-update setiap kali Store berubah via subscribe
  isInCart = false;
  private cartItems: PokemonDetail[] = [];

  private typeColors: { [key: string]: string } = {
    fire: '#FF6B35', water: '#4FC3F7', grass: '#66BB6A',
    electric: '#FFCA28', psychic: '#EC407A', ice: '#80DEEA',
    dragon: '#7B1FA2', dark: '#4E342E', fairy: '#F48FB1',
    normal: '#9E9E9E', fighting: '#D32F2F', flying: '#7986CB',
    poison: '#AB47BC', ground: '#FFCC02', rock: '#8D6E63',
    bug: '#8BC34A', ghost: '#5C6BC0', steel: '#78909C',
  };

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private store: Store   // inject Store NgRx — tersedia karena provideStore() di app.config.ts
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadPokemonDetails(params['id'] as string);
      }
    });

    this.store.select(selectCartItems).subscribe(items => {
      this.cartItems = items;
      this.isInCart = items.some(p => p.id === this.pokemon?.id);
    });
  }

  async loadPokemonDetails(id: string) {
    try {
      const rawDetail = await this.pokemonService.getPokemonById(id);
      this.pokemon = this.mapToPokemonDetail(rawDetail, id);
      this.isInCart = this.cartItems.some(p => p.id === this.pokemon?.id);

      setTimeout(() => { this.statsLoaded = true; }, 0);

      await this.loadEvolutionChain(rawDetail.id);

    } catch (error) {
      console.error('Error loading pokemon detail:', error);
    }
  }

  // Toggle: jika sudah di cart → remove, jika belum → add
  toggleCart() {
    if (!this.pokemon) return;

    if (this.isInCart) {
      // dispatch removeFromCart dengan pokemonId sebagai payload
      this.store.dispatch(removeFromCart({ pokemonId: this.pokemon.id }));
    } else {
      // dispatch addToCart dengan object pokemon lengkap sebagai payload
      this.store.dispatch(addToCart({ pokemon: this.pokemon }));
    }
  }


  async loadEvolutionChain(pokemonId: number) {
    try {
      this.isLoadingEvolution = true;

      const species = await this.pokemonService.getPokemonSpecies(pokemonId);
      const chainData = await this.pokemonService.getEvolutionChain(species.evolution_chain.url);
      const names = this.flattenChain(chainData.chain);

      this.evolutionChain = await Promise.all(
        names.map(async (name) => {
          const detail = await this.pokemonService.getPokemonById(name);
          return {
            name: detail.name,
            id: detail.id,
            image: detail.sprites?.other?.['official-artwork']?.front_default
                  || detail.sprites?.front_default
          } as EvolutionStage;
        })
      );

    } catch (error) {
      console.warn('Evolution chain tidak tersedia:', error);
      this.evolutionChain = [];
    } finally {
      this.isLoadingEvolution = false;
    }
  }

  private flattenChain(chain: any): string[] {
    const result: string[] = [chain.species.name];
    for (const evo of chain.evolves_to) {
      result.push(...this.flattenChain(evo));
    }
    return result;
  }

  goToEvolution(stage: EvolutionStage) {
    if (stage.id === this.pokemon?.id) return;
    this.router.navigate(['/pokemon/detail', stage.id]);
  }

  private mapToPokemonDetail(rawDetail: any, id: string): PokemonDetail {
    return {
      id: rawDetail.id,
      name: rawDetail.name,
      url: `${this.pokemonService.apiUrl}/${id}`,
      image: rawDetail.sprites?.front_default,
      officialImage: rawDetail.sprites?.other?.['official-artwork']?.front_default,
      types: rawDetail.types.map((t: any) => t.type.name),
      height: rawDetail.height,
      weight: rawDetail.weight,
      cries: rawDetail.cries,
      stats: rawDetail.stats,
      abilities: rawDetail.abilities?.slice(0, 3).map((a: any) =>
        a.ability.name.replace(/-/g, ' ')
      ),
    };
  }

  getTypeColor(type: string): string {
    return this.typeColors[type] || '#A8A8A8';
  }

  getStatPercent(baseStat: number): number {
    return Math.round((baseStat / 255) * 100);
  }

  getStatColor(baseStat: number): string {
    if (baseStat < 50) return '#F44336';
    if (baseStat < 90) return '#FF9800';
    if (baseStat < 130) return '#FFEB3B';
    return '#4CAF50';
  }

  formatStatName(name: string): string {
    const map: { [key: string]: string } = {
      'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF',
      'special-attack': 'Sp.ATK', 'special-defense': 'Sp.DEF', 'speed': 'SPD',
    };
    return map[name] || name;
  }

  getHeightInMeters(): string {
    return this.pokemon ? (this.pokemon.height / 10).toFixed(1) + ' m' : '';
  }

  getWeightInKg(): string {
    return this.pokemon ? (this.pokemon.weight / 10).toFixed(1) + ' kg' : '';
  }

  goBack() {
    this.location.back();
  }

  hearCry() {
    if (this.pokemon?.cries?.latest) {
      const audio = new Audio(this.pokemon.cries.latest);
      audio.play().catch(e => console.error('Gagal memutar suara:', e));
    } else if (this.pokemon?.cries?.legacy) {
      const audio = new Audio(this.pokemon.cries.legacy);
      audio.play().catch(e => console.error('Gagal memutar suara:', e));
    } else {
      alert('Suara pokemon ini tidak tersedia!');
    }
  }
}
