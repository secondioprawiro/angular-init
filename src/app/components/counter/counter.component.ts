import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent implements OnInit, OnChanges, OnDestroy{
  @Input() startCount: number = 0;
  @Input() increment: number = 1;

  public counter: number = 0;

  ngOnInit(): void {
    console.log('Counter Component Called');
    this.counter = this.startCount;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Couter Component Changes: ', changes)
    if(changes['startCount']){
      this.counter = changes['startCount'].currentValue;
    }
  }

  ngOnDestroy(): void {
    console.log('Counter Component Destroyed');
  }

  resetCounter(){
    this.counter = this.startCount;
  }

  addCounter(){
    this.counter += this.increment;
  }

  decCounter(){
    this.counter -= this.increment;
  }
}
