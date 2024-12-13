// src/app/models/hotel-contract-dto.model.ts

export interface RoomType {
    roomType: string;
    pricePerPerson: number;
    amountOfRooms: number;
    maxAdults: number;
  }
  
  export interface HotelContractDto {
    id: number;
    hotelName: string;
    contractValidFrom: string;
    contractValidTo: string;
    markupPercentage: number;
    roomTypes: RoomType[];
  }
  