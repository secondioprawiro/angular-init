import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PokemonFavoritesComponent } from './pokemon-favorites/pokemon-favorites.component';
import { CardComponent } from './card/card.component';
import { ListComponent } from './list/list.component';
import { DetailPokemonComponent } from './detail-pokemon/detail-pokemon.component';

const routes: Routes = [
  {
    path: 'favorites',
    component: PokemonFavoritesComponent
  },
  {
    path: '',
    redirectTo: 'favorites',
    pathMatch: 'full'
  },
  {
    path: 'List',
    component: ListComponent
  },
  {
    path: 'detail/:id',
    component: DetailPokemonComponent
  }
]

@NgModule({
  declarations: [
    PokemonFavoritesComponent,
    CardComponent,
    ListComponent,
    DetailPokemonComponent
  ],
  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class PokemonModule { }
