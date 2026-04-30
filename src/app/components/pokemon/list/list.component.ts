import { Component, OnInit } from '@angular/core';
import {
  PokemonResultResponse,
  PokemonDetail,
  PokemonListResponse,
} from '../../../utils/interface';
import { PokemonService } from '../../../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  listPokemonDetails: PokemonDetail[] = [];
  listFilterPokemon: PokemonDetail[] = [];

  // Warna per tipe — dipakai untuk styling tombol filter
  readonly typeColors: { [key: string]: string } = {
    fire: '#FF6B35', water: '#4FC3F7', grass: '#66BB6A',
    electric: '#FFCA28', psychic: '#EC407A', ice: '#80DEEA',
    dragon: '#7B1FA2', dark: '#4E342E', fairy: '#F48FB1',
    normal: '#9E9E9E', fighting: '#D32F2F', flying: '#7986CB',
    poison: '#AB47BC', ground: '#FFCC02', rock: '#8D6E63',
    bug: '#8BC34A', ghost: '#5C6BC0', steel: '#78909C',
  };

  masterPokemonList: PokemonResultResponse[] = []; // semua nama pokemon
  typeResultCache: PokemonResultResponse[] = [];   // semua pokemon dari tipe yang dipilih

  isLoading = true;
  isSearching = false; 
  elements: PokemonResultResponse[] = [];
  search: string = '';
  selectedElement: string = '';

  
  nextUrl: string | null = null;
  prevUrl: string | null = null;
  private savedNextUrl: string | null = null;
  private savedPrevUrl: string | null = null;
  private savedTotalCount = 0;
  private savedCurrentPage = 1;

  // Info halaman
  currentPage = 1;
  totalCount = 0;
  itemsPerPage = 20;
  totalPage = 1;

  constructor(private pokemonService: PokemonService, private router: Router) {}

  async ngOnInit() {
    const response = await this.pokemonService.getPokemonList(this.itemsPerPage);
    await this.loadPokemon(response);
    await this.loadTypes();

    this.masterPokemonList = await this.pokemonService.getAllPokemonNames();
  }

  private async mapToDetail(pokemon: PokemonResultResponse): Promise<PokemonDetail> {
    const detail = await this.pokemonService.getPokemonDetails(pokemon.url);
    return {
      id: detail.id,
      name: detail.name,
      url: pokemon.url,
      image: detail.sprites.front_default,
      types: detail.types.map((t: any) => t.type.name),
      height: detail.height,
      weight: detail.weight,
    };
  }

  async loadPokemon(response: PokemonListResponse): Promise<void> {
    try {
      this.isLoading = true;
      this.listPokemonDetails = await Promise.all(response.results.map(p => this.mapToDetail(p)));
      this.listFilterPokemon = this.listPokemonDetails;
      this.nextUrl = response.next;
      this.prevUrl = response.previous;
      this.totalCount = response.count;
      this.savedNextUrl = response.next;
      this.savedPrevUrl = response.previous;
      this.savedTotalCount = response.count;
      this.savedCurrentPage = this.currentPage;
      this.updatePagination();
    } catch (error) {
      console.log('Error', error);
    } finally {
      this.isLoading = false;
    }
  }

  async filterPokemon(): Promise<void> {
    if (this.search.trim() === '') {
      this.listFilterPokemon = this.listPokemonDetails;
      this.nextUrl = this.savedNextUrl;
      this.prevUrl = this.savedPrevUrl;
      this.totalCount = this.savedTotalCount;
      this.currentPage = this.savedCurrentPage;
      this.updatePagination();
      return;
    }

    const source = this.selectedElement ? this.typeResultCache : this.masterPokemonList;
    const matched = source.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()));

    this.totalCount = matched.length;
    this.totalPage = Math.ceil(matched.length / this.itemsPerPage);
    this.currentPage = 1;
    this.nextUrl = matched.length > this.itemsPerPage ? 'search' : null;
    this.prevUrl = null;

    const paged = matched.slice(0, this.itemsPerPage);

    try {
      this.isSearching = true;
      this.listFilterPokemon = await Promise.all(paged.map(p => this.mapToDetail(p)));
    } catch (error) {
      console.log('Error', error);
    } finally {
      this.isSearching = false;
    }
  }

  updatePagination(): void {
    this.totalPage = Math.ceil(this.totalCount / this.itemsPerPage);
  }

  async loadNext(): Promise<void> {
    if (this.currentPage >= this.totalPage) return;
    this.currentPage++;
    if (this.search.trim()) {
      await this.loadSearchPage();
    } else {
      await this.loadCurrentPageData();
    }
  }

  async loadPrevious(): Promise<void> {
    if (this.currentPage <= 1) return;
    this.currentPage--;
    if (this.search.trim()) {
      await this.loadSearchPage();
    } else {
      await this.loadCurrentPageData();
    }
  }

  async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.totalPage || page === this.currentPage) return;
    this.currentPage = page;
    if (this.search.trim()) {
      await this.loadSearchPage();
    } else {
      await this.loadCurrentPageData();
    }
  }

  private async loadSearchPage(): Promise<void> {
    const source = this.selectedElement ? this.typeResultCache : this.masterPokemonList;
    const matched = source.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()));
    const offset = (this.currentPage - 1) * this.itemsPerPage;
    const paged = matched.slice(offset, offset + this.itemsPerPage);

    this.nextUrl = offset + this.itemsPerPage < matched.length ? 'search' : null;
    this.prevUrl = offset > 0 ? 'search' : null;

    try {
      this.isSearching = true;
      this.listFilterPokemon = await Promise.all(paged.map(p => this.mapToDetail(p)));
    } catch (error) {
      console.log('Error', error);
    } finally {
      this.isSearching = false;
    }
  }

  // Fungsi Untuk Memuat Data Halaman Saat Ini
  private async loadCurrentPageData(): Promise<void> {
    const offset = (this.currentPage - 1) * this.itemsPerPage;

    if (this.selectedElement === '') {
      // Sedang di "All Types", gunakan pagination API
      const url = `${this.pokemonService.apiUrl}?limit=${this.itemsPerPage}&offset=${offset}`;
      const response = await this.pokemonService.getPokemonListByUrl(url);
      await this.loadPokemon(response);
    } else {
      // Sedang di "Type Tertentu", gunakan pagination LOKAL (slice dari cache)
      const paginatedResults = this.typeResultCache.slice(offset, offset + this.itemsPerPage);

      // Buat tiruan respon API agar pagination tetap berjalan normal
      const fakeResponse: PokemonListResponse = {
        count: this.typeResultCache.length,
        next: (offset + this.itemsPerPage < this.typeResultCache.length) ? 'has_next' : null,
        previous: (offset > 0) ? 'has_prev' : null,
        results: paginatedResults
      };

      await this.loadPokemon(fakeResponse);
    }
  }

  get pages(): number[] {
    const pagesArray = [];
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPage, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  async selectType(typeName: string) {
    this.selectedElement = typeName;
    this.currentPage = 1;
    this.search = '';

    if (typeName === '') {
      this.typeResultCache = [];
      const response = await this.pokemonService.getPokemonList(this.itemsPerPage);
      await this.loadPokemon(response);
    } else {
      const response = await this.pokemonService.getPokemonByType(typeName);
      this.typeResultCache = response.results; // Simpan semua ke cache

      // Panggil sistem pintar kita untuk memuat halaman pertama dari tipe ini
      await this.loadCurrentPageData();
    }
  }

  async loadTypes() {
    const response = await this.pokemonService.getPokemonTypes();
    this.elements = response.results;
  }

  getTypeColor(type: string): string {
    return this.typeColors[type] || '#9E9E9E';
  }

  navigateToDetail(pokemon: PokemonDetail) {
    this.router.navigate(['/pokemon/detail', pokemon.id]);
  }
}
