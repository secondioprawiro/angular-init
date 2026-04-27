import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvComponent } from './cv.component';
import { CvRoutingModule } from './cv-routing.module';
import { CounterComponent } from '../counter/counter.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CounterComponent
  ],
  exports: [
    CvRoutingModule
  ]

})
export class CvModule { }
