// src/app/services/hotel-search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

/**
 * Interface representing a single room request in the search criteria.
 */
interface RoomRequest {
  noOfRooms: number;
  noOfAdults: number;
}

/**
 * Interface representing the search criteria for hotel availability.
 */
interface SearchCriteria {
  checkInDate: string;
  noOfNights: number;
  roomRequests: RoomRequest[];
}

/**
 * Interface representing a single room type result from the search.
 */
interface RoomTypeResult {
  roomType: string;
  markedUpPrice: number;
}

/**
 * Interface representing the search result for a single hotel.
 */

interface SearchResult {
  hotelName: string;
  roomTypes: RoomTypeResult[];
}

/**
 * Injectable service for performing hotel searches.
 * This service communicates with the backend API to fetch available hotel data based on user-defined criteria.
 */

@Injectable({
  providedIn: 'root',
})
export class HotelSearchService {
  /**
   * Base URL for the hotel search endpoint, derived from the environment configuration.
   */
  private apiUrl = `${environment.apiUrl}/api/v1/hotels/search`;

  /**
   * Constructor to inject the HttpClient service.
   *
   * @param http HttpClient service for making HTTP requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Searches for hotels based on the given criteria.
   *
   * @param criteria Search criteria including check-in date, number of nights, and room requests
   * @returns An Observable array of search results, where each result represents a hotel's available room types
   */

  searchHotels(criteria: SearchCriteria): Observable<SearchResult[]> {
    return this.http.post<SearchResult[]>(this.apiUrl, criteria);
  }
}
