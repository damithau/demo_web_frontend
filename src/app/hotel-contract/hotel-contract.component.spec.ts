import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HotelContractService } from '../services/hotel-contract.service';
import { HotelContractComponent } from './hotel-contract.component';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

// Mock Service
class MockHotelContractService {
  getContractById(id: number) {
    return of({
      id,
      hotelName: 'Test Hotel',
      contractValidFrom: '2024-01-01',
      contractValidTo: '2024-12-31',
      markupPercentage: 10,
    });
  }
  submitContract(contractData: any) {
    return of({ success: true });
  }
}

describe('HotelContractComponent', () => {
  let component: HotelContractComponent;
  let fixture: ComponentFixture<HotelContractComponent>;
  let service: HotelContractService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      // declarations: [HotelContractComponent],
      providers: [HotelContractService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelContractComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(HotelContractService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    const form = component.contractForm;
    expect(form).toBeDefined();
    expect(form.get('hotelName')?.value).toBe('');
    expect(form.get('markupPercentage')?.value).toBe(0);
    expect(form.get('roomTypes')?.value.length).toBe(0);
  });

  it('should add a room type to the form', () => {
    component.addRoomType();
    const roomTypes = component.roomTypes;
    expect(roomTypes.length).toBe(1);
    const roomTypeGroup = roomTypes.at(0);
    expect(roomTypeGroup.get('roomType')?.value).toBe('');
    expect(roomTypeGroup.get('pricePerPerson')?.value).toBe(0);
  });

  it('should remove a room type from the form', () => {
    component.addRoomType();
    component.addRoomType();
    expect(component.roomTypes.length).toBe(2);
    component.removeRoomType(1);
    expect(component.roomTypes.length).toBe(1);
  });

  it('should validate minimum one room type', () => {
    component.submit();
    expect(
      component.contractForm.get('roomTypes')?.hasError('noRoomTypes')
    ).toBeTrue();
  });

  // it('should call getContractById on searchContract', () => {
  //   const serviceSpy = spyOn(service, 'getContractById').and.callThrough();
  //   component.contractId = 1;
  //   component.searchContract();
  //   expect(serviceSpy).toHaveBeenCalledWith(1);
  //   expect(component.contractDetails?.hotelName).toBe('Test Hotel');
  // });

  it('should handle errors when fetching contract by id', () => {
    spyOn(service, 'getContractById').and.returnValue(
      throwError(() => new Error('Not Found'))
    );
    component.contractId = 1;
    component.searchContract();
    expect(component.errorMessage).toBe(
      'Contract not found or error fetching data.'
    );
    expect(component.contractDetails).toBeNull();
  });

  it('should call submitContract when form is valid', () => {
    const serviceSpy = spyOn(service, 'submitContract').and.callThrough();
    component.addRoomType();
    component.contractForm.patchValue({
      hotelName: 'Test Hotel',
      contractValidFrom: '2024-01-01',
      contractValidTo: '2024-12-31',
      markupPercentage: 10,
    });
    component.roomTypes.at(0).patchValue({
      roomType: 'Single',
      pricePerPerson: 100,
      amountOfRooms: 10,
      maxAdults: 2,
    });

    component.submit();
    expect(serviceSpy).toHaveBeenCalled();
    expect(component.contractForm.valid).toBeTrue();
  });

  it('should not submit when form is invalid', () => {
    const serviceSpy = spyOn(service, 'submitContract');
    component.submit();
    expect(serviceSpy).not.toHaveBeenCalled();
  });
});
