import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PokemonListResponse, PokemonResultResponse } from '../utils/interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  public readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  public readonly apiUrlType = 'https://pokeapi.co/api/v2/type';

  constructor(private http: HttpClient) {}

  async getPokemonList(limit: number = 20): Promise<PokemonListResponse> {
    return firstValueFrom(
      this.http.get<PokemonListResponse>(`${this.apiUrl}?limit=${limit}`)
    );
  }

  async getAllPokemonNames(): Promise<PokemonResultResponse[]> {
    const response = await firstValueFrom(
      this.http.get<PokemonListResponse>(`${this.apiUrl}?limit=100000`)
    );
    return response.results;
  }

  async getPokemonListByUrl(url: string): Promise<PokemonListResponse> {
    return firstValueFrom(
      this.http.get<PokemonListResponse>(url)
    );
  }

  async getPokemonByType(typeName: string): Promise<PokemonListResponse> {
    const response = await firstValueFrom(
      this.http.get<any>(`${this.apiUrlType}/${typeName}`)
    );
    return {
      results: response.pokemon.map((p: any) => p.pokemon),
      count: response.pokemon.length,
      next: null,
      previous: null
    };
  }

  async getPokemonDetails(url: string){
    const response = await firstValueFrom(
      this.http.get<any>(url)
    );
    return response;
  }

  async getPokemonTypes(): Promise<PokemonListResponse> {
    return firstValueFrom(
      this.http.get<PokemonListResponse>(this.apiUrlType)
    );
  }
}
