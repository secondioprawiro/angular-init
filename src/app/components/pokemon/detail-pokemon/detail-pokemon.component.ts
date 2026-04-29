import { Component } from '@angular/core';
import { PokemonService } from '../../../services/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PokemonDetail } from '../../../utils/interface';

@Component({
  selector: 'app-detail-pokemon',
  standalone: false,
  templateUrl: './detail-pokemon.component.html',
  styleUrl: './detail-pokemon.component.css'
})
export class DetailPokemonComponent {

  pokemon: PokemonDetail | null = null;

  constructor
  ( private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ){}

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      if (params['id']) {
        this.loadPokemonDetails(params['id'] as string);
      }
      
    })
  }

  async loadPokemonDetails(id: string){
    try{
      // Ambil data mentah dari API
      const rawDetail = await this.pokemonService.getPokemonById(id);
      
      // Gunakan fungsi mapping
      this.pokemon = this.mapToPokemonDetail(rawDetail, id);
      
      console.log('Pokemon Detail Loaded:', this.pokemon);
    }catch(error){
      console.error('Error loading pokemon detail:', error);
    }
  }

  // Fungsi mapping yang bisa digunakan kembali (reusable)
  private mapToPokemonDetail(rawDetail: any, id: string): PokemonDetail {
    return {
      id: rawDetail.id,
      name: rawDetail.name,
      url: `${this.pokemonService.apiUrl}/${id}`,
      image: rawDetail.sprites?.front_default,
      types: rawDetail.types.map((t: any) => t.type.name),
      height: rawDetail.height,
      weight: rawDetail.weight,
      cries: rawDetail.cries,
      stats: rawDetail.stats
    };
  }

  goBack() {
    this.location.back();
  }

  hearCry(){
    if(this.pokemon?.cries?.latest){
      const audio = new Audio(this.pokemon.cries.latest);
      audio.play().catch(e => console.error("Gagal memutar suara:", e));
    } else if(this.pokemon?.cries?.legacy){
      const audio = new Audio(this.pokemon.cries.legacy);
      audio.play().catch(e => console.error("Gagal memutar suara:", e));
    } else {
      alert("Suara pokemon ini tidak tersedia!");
    }
  }
}
