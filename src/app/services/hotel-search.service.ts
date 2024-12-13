// src/app/services/hotel-search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface RoomRequest {
  noOfRooms: number;
  noOfAdults: number;
}

interface SearchCriteria {
  checkInDate: string;
  noOfNights: number;
  roomRequests: RoomRequest[];
}

interface RoomTypeResult {
  roomType: string;
  markedUpPrice: number;
}

interface SearchResult {
  hotelName: string;
  roomTypes: RoomTypeResult[];
}

@Injectable({
  providedIn: 'root',
})
export class HotelSearchService {
  private apiUrl = `${environment.apiUrl}/api/v1/hotels/search`;

  constructor(private http: HttpClient) {}

  searchHotels(criteria: SearchCriteria): Observable<SearchResult[]> {
    return this.http.post<SearchResult[]>(this.apiUrl, criteria);
  }
}
