import { Component, OnInit } from '@angular/core';
import {
  PokemonResultResponse,
  PokemonDetail,
  PokemonListResponse,
} from '../../../utils/interface';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  listPokemonDetails: PokemonDetail[] = [];  // data detail halaman saat ini
  listFilterPokemon: PokemonDetail[] = [];   // data yang ditampilkan (setelah search)

  masterPokemonList: PokemonResultResponse[] = []; // semua nama pokemon
  typeResultCache: PokemonResultResponse[] = [];   // semua pokemon dari tipe yang dipilih

  isLoading = true;
  isSearching = false; 
  elements: PokemonResultResponse[] = [];
  search: string = '';
  selectedElement: string = '';

  
  nextUrl: string | null = null;
  prevUrl: string | null = null;

  // Info halaman
  currentPage = 1;
  totalCount = 0;
  itemsPerPage = 20;
  totalPage = 1;

  constructor(private pokemonService: PokemonService) {}

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
      return;
    }

    const source = this.selectedElement ? this.typeResultCache : this.masterPokemonList;
    const matched = source
      .filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()))
      .slice(0, this.itemsPerPage);

    try {
      this.isSearching = true;
      this.listFilterPokemon = await Promise.all(matched.map(p => this.mapToDetail(p)));
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
    if (!this.nextUrl) return;
    this.currentPage++;
    const response = await this.pokemonService.getPokemonListByUrl(this.nextUrl);
    await this.loadPokemon(response);
  }

  async loadPrevious(): Promise<void> {
    if (!this.prevUrl) return;
    this.currentPage--;
    const response = await this.pokemonService.getPokemonListByUrl(this.prevUrl);
    await this.loadPokemon(response);
  }

  async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.totalPage || page === this.currentPage) return;
    this.currentPage = page;
    const offset = (page - 1) * this.itemsPerPage;
    const url = `${this.pokemonService.apiUrl}?limit=${this.itemsPerPage}&offset=${offset}`;
    const response = await this.pokemonService.getPokemonListByUrl(url);
    await this.loadPokemon(response);
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

      const slicedResponse = {
        ...response,
        results: response.results.slice(0, this.itemsPerPage),
      };

      await this.loadPokemon(slicedResponse);
    }
  }

  async loadTypes() {
    const response = await this.pokemonService.getPokemonTypes();
    this.elements = response.results;
  }
}
