import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GachaModelComponent } from './gacha-model.component';

describe('GachaModelComponent', () => {
  let component: GachaModelComponent;
  let fixture: ComponentFixture<GachaModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GachaModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GachaModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
