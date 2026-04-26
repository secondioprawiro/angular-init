import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CvData } from '../../utils/interface';
import { CvService } from '../../services/cv.service';

@Component({
  selector: 'app-cv',
  standalone: true,
  templateUrl: './cv.component.html',
  imports: [CommonModule],
  styleUrl: './cv.component.css'
})
export class CvComponent {
  cvData: CvData;

  constructor(private cvService: CvService) {
    this.cvData = this.cvService.getDataCv();
  }
}
