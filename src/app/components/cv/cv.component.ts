import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CvData } from '../../utils/interface';
import { CvService } from '../../services/cv.service';
import { CounterComponent } from '../counter/counter.component';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cv',
  standalone: true,
  templateUrl: './cv.component.html',
  imports: [CommonModule, CounterComponent, FormsModule],
  styleUrl: './cv.component.css'
})
export class CvComponent {
  cvData: CvData;
  startCount: number = 10;
  incrementBy: number = 2;
  isHide: boolean = false;

  constructor(private cvService: CvService) {
    this.cvData = this.cvService.getDataCv();
  }
}
