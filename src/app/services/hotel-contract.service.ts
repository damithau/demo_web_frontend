import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelContractDto } from '../models/hotel-contract-dto.model';


/**
 * Interface representing the structure of a room type within a hotel contract.
 */
interface RoomType {
  roomType: string;
  pricePerPerson: number;
  amountOfRooms: number;
  maxAdults: number;
}

/**
 * Interface representing the structure of a hotel contract.
 */

export interface HotelContract {
  hotelName: string;
  contractValidFrom: string;
  contractValidTo: string;
  markupPercentage: number;
  roomTypes: RoomType[];
}

/**
 * Injectable service for managing hotel contracts.
 * This service interacts with the backend API to handle CRUD operations
 * for hotel contracts.
 */

@Injectable({
  providedIn: 'root',
})
export class HotelContractService {

   /**
   * Base URL for the backend API endpoints related to hotel contracts.
   */
  private baseUrl = 'http://localhost:8080/api/v1/contract';

  constructor(private http: HttpClient) {}

  /**
   * Submits a new hotel contract to the backend.
   * 
   * @param contract The hotel contract to be submitted
   * @returns An Observable of the submitted hotel contract
   */

  submitContract(contract: HotelContract): Observable<HotelContract> {
    return this.http.post<HotelContract>(`${this.baseUrl}/submit`, contract);
  }

  /**
   * Retrieves a hotel contract by its ID.
   * 
   * @param contractId The unique identifier of the contract to retrieve
   * @returns An Observable of the HotelContractDto containing the contract details
   */

  getContractById(contractId: number): Observable<HotelContractDto> {
    return this.http.get<HotelContractDto>(`${this.baseUrl}/${contractId}`);
  }

  /**
   * Updates the markup percentage for a specific hotel contract.
   * 
   * @param contractId The unique identifier of the contract to update
   * @param markupPercentage The new markup percentage to be set
   * @returns An Observable of the API response
   */
  updateMarkupPercentage(contractId: number, markupPercentage: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${contractId}/markup`, null, {
      params: { markupPercentage: markupPercentage.toString() },
    });
  }
}
