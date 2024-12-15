import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { viewContractsComponent } from './view-contracts.component';
import { HotelContractService } from '../services/hotel-contract.service';
import { HotelContractDto } from '../models/hotel-contract-dto.model';
import { By } from '@angular/platform-browser';

class MockHotelContractService {
  getContractById(contractId: number) {
    if (contractId === 1) {
      return of({
        hotelName: 'Test Hotel',
        contractValidFrom: '2024-01-01',
        contractValidTo: '2024-12-31',
        markupPercentage: 10,
        roomTypes: [
          {
            roomType: 'Deluxe',
            pricePerPerson: 100,
            amountOfRooms: 5,
            maxAdults: 2,
          },
        ],
      } as HotelContractDto);
    }
    return throwError(() => new Error('Contract not found'));
  }

  updateMarkupPercentage(contractId: number, markupPercentage: number) {
    if (contractId === 1) {
      return of({ success: true });
    }
    return throwError(() => new Error('Update failed'));
  }
}

describe('viewContractsComponent', () => {
  let component: viewContractsComponent;
  let fixture: ComponentFixture<viewContractsComponent>;
  let contractService: HotelContractService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: HotelContractService, useClass: MockHotelContractService },
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(viewContractsComponent);
    component = fixture.componentInstance;
    contractService = TestBed.inject(HotelContractService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch contract details by ID', () => {
    component.contractId = 1;
    component.searchContract();

    fixture.detectChanges();

    expect(component.contractDetails).toBeTruthy();
    expect(component.contractDetails?.hotelName).toBe('Test Hotel');
    expect(component.contractForm.value.markupPercentage).toBe(10);
  });

  it('should show error message when contract is not found', () => {
    component.contractId = 999; // Non-existing contract ID
    component.searchContract();

    fixture.detectChanges();

    expect(component.contractDetails).toBeNull();
    expect(component.errorMessage).toBe(
      'Contract not found or error fetching data.'
    );
  });

  it('should show validation error if form is invalid', () => {
    component.contractId = 1;
    component.contractForm.patchValue({
      markupPercentage: -5, // Invalid markup percentage
    });

    component.updateMarkupPercentage();

    fixture.detectChanges();

    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe(
      'Please fill out all required fields correctly.'
    );
  });
});
