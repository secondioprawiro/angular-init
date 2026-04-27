import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PokemonFavoritesComponent } from './pokemon-favorites/pokemon-favorites.component';
import { CardComponent } from './card/card.component';

const routes: Routes = [
  {
    path: 'favorites',
    component: PokemonFavoritesComponent
  },
  {
    path: '',
    redirectTo: 'favorites',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    PokemonFavoritesComponent,
    CardComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class PokemonModule { }
