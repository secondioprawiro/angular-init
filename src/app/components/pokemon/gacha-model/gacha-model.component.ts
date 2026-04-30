import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PokemonService } from '../../../services/pokemon.service';
import { GachaResult } from '../../../utils/interface';

type GachaState = 'idle' | 'rolling' | 'revealed';

@Component({
  selector: 'app-gacha-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gacha-model.component.html',
  styleUrl: './gacha-model.component.css'
})
export class GachaModelComponent {

  isOpen = false;
  state: GachaState = 'idle';
  result: GachaResult | null = null;

  // Total Pokemon mainline Gen 1–9 (ID 1–1010)
  // Hindari Pokemon bentuk alternatif (ID > 1010) karena banyak yang tidak punya gambar lengkap
  private readonly MAX_POKEMON_ID = 1302;

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
    private router: Router
  ) {}

  open() {
    this.isOpen = true;
    this.result = null;
    this.roll();
  }

  close() {
    this.isOpen = false;
    this.state = 'idle';
    this.result = null;
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('gacha-backdrop')) {
      this.close();
    }
  }

  async roll() {
    this.state = 'rolling';
    this.result = null;

    try {
      const randomId = Math.floor(Math.random() * this.MAX_POKEMON_ID) + 1;
      const detail = await this.pokemonService.getPokemonById(randomId.toString());

      await new Promise(resolve => setTimeout(resolve, 2000));

      this.result = {
        id: detail.id,
        name: detail.name,
        image: detail.sprites?.other?.['official-artwork']?.front_default
              || detail.sprites?.front_default,
        types: detail.types.map((t: any) => t.type.name),
      };

      this.state = 'revealed';

    } catch (error) {
      console.error('Gacha error:', error);
      this.state = 'idle';
    }
  }

  // Gacha lagi tanpa tutup modal
  rollAgain() {
    this.roll();
  }

  goToDetail() {
    if (!this.result) return;
    const id = this.result.id;
    this.close();
    this.router.navigate(['/pokemon/detail', id]);
  }

  getTypeColor(type: string): string {
    return this.typeColors[type] || '#9E9E9E';
  }

  // Warna gradient hero berdasarkan tipe utama
  getCardGradient(): string {
    const color = this.result ? this.getTypeColor(this.result.types[0]) : '#9E9E9E';
    return `linear-gradient(135deg, ${color}CC, ${color}44)`;
  }
}
