import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelContractDto } from '../models/hotel-contract-dto.model';

interface RoomType {
  roomType: string;
  pricePerPerson: number;
  amountOfRooms: number;
  maxAdults: number;
}

export interface HotelContract {
  hotelName: string;
  contractValidFrom: string;
  contractValidTo: string;
  markupPercentage: number;
  roomTypes: RoomType[];
}

@Injectable({
  providedIn: 'root',
})
export class HotelContractService {
  private baseUrl = 'http://localhost:8080/api/v1/contract';

  constructor(private http: HttpClient) {}

  submitContract(contract: HotelContract): Observable<HotelContract> {
    return this.http.post<HotelContract>(`${this.baseUrl}/submit`, contract);
  }

  getContractById(contractId: number): Observable<HotelContractDto> {
    return this.http.get<HotelContractDto>(`${this.baseUrl}/${contractId}`);
  }
  updateMarkupPercentage(contractId: number, markupPercentage: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${contractId}/markup`, null, {
      params: { markupPercentage: markupPercentage.toString() },
    });
  }
}
