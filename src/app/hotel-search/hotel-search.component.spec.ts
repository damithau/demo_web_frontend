import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HotelSearchComponent } from './hotel-search.component';
import { HotelSearchService } from '../services/hotel-search.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

// Mock HotelSearchService
class MockHotelSearchService {
  searchHotels(criteria: any) {
    return of([
      {
        hotelName: 'Test Hotel',
        roomTypes: [
          { roomType: 'Single', markedUpPrice: 100 },
          { roomType: 'Double', markedUpPrice: 200 },
        ],
      },
    ]);
  }
}

describe('HotelSearchComponent', () => {
  let component: HotelSearchComponent;
  let fixture: ComponentFixture<HotelSearchComponent>;
  let hotelSearchService: HotelSearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HotelSearchComponent, // Import the standalone component directly
        FormsModule,
        HttpClientTestingModule,
        MatExpansionModule,
        MatDividerModule,
      ],
      providers: [
        { provide: HotelSearchService, useClass: MockHotelSearchService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchComponent);
    component = fixture.componentInstance;
    hotelSearchService = TestBed.inject(HotelSearchService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form fields and no room requests', () => {
    expect(component.checkInDate).toBeUndefined();
    expect(component.noOfNights).toBeUndefined();
    expect(component.roomRequests.length).toBe(0);
    expect(component.searchResults.length).toBe(0);
    expect(component.errorMessage).toBe('');
  });

  it('should add a room request', () => {
    component.addRoomRequest();
    expect(component.roomRequests.length).toBe(1);
    expect(component.roomRequests[0]).toEqual({ noOfRooms: 1, noOfAdults: 1 });
  });

  it('should remove a room request', () => {
    component.addRoomRequest();
    component.addRoomRequest();
    expect(component.roomRequests.length).toBe(2);

    component.removeRoomRequest(0);
    expect(component.roomRequests.length).toBe(1);
  });

  it('should disable the search button if required fields are empty', () => {
    const button = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(button.disabled).toBeTrue();

    // Set valid form values
    component.checkInDate = '2024-01-01';
    component.noOfNights = 2;
    component.addRoomRequest();
    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });

  it('should show "No results found" when search returns an empty array', () => {
    // Mock the searchHotels service to return an empty array
    spyOn(hotelSearchService, 'searchHotels').and.returnValue(of([]));

    // Trigger the search
    component.checkInDate = '2024-01-01';
    component.noOfNights = 2;
    component.addRoomRequest();
    component.roomRequests[0] = { noOfRooms: 1, noOfAdults: 2 };

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null); // Simulate form submission

    fixture.detectChanges();

    // Expect the "No results found" message to be displayed
    const noResultsMessage = fixture.debugElement.query(By.css('div p'));
    
  });
});
