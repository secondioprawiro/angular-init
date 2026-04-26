import { Injectable } from '@angular/core';
import { CvData } from '../utils/interface';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  constructor() { 
    console.log('cv constructor')
  }

  getDataCv(): CvData {
    return {
      name: "Bima Satria",
      role: "Software Engineer",
      email: "bima@gmail.com",
      experience: [
        { company: "X", position: "Engineer", period: "2022 - 2023" },
        { company: "Y", position: "Engineer", period: "2023 - Sekarang" }
      ]
    };
  }
  
}
