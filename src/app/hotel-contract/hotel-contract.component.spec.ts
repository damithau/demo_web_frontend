import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelContractComponent } from './hotel-contract.component';

describe('HotelContractComponent', () => {
  let component: HotelContractComponent;
  let fixture: ComponentFixture<HotelContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
