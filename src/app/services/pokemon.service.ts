import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {

  }

  async getPokemonList(limit: number = 50){
    const response = await firstValueFrom(
      this.http.get<any>(`${this.apiUrl}?limit=${limit}`)
    );
    return response.results;
  }
  
  async getPokemonDetails(url: string){
    const response = await firstValueFrom(
      this.http.get<any>(url)
    );
    return response;
  }
}
