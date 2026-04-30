import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { GachaModelComponent } from '../pokemon/gacha-model/gacha-model.component';
import { CartComponent } from '../pokemon/cart/cart.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent, GachaModelComponent, CartComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  @ViewChild(GachaModelComponent) gachaModal!: GachaModelComponent;

  openGacha() {
    this.gachaModal.open();
  }
}
