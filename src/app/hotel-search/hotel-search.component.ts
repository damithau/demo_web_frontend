// src/app/components/hotel-search/hotel-search.component.ts
import { Component } from '@angular/core';
import { HotelSearchService } from '../services/hotel-search.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';


/**
 * The HotelSearchComponent allows users to search for hotels based on
 * criteria such as check-in date, number of nights, and room requests.
 *
 * It displays the search results and provides a feature to calculate
 * the total price of each hotel based on the room types and number of nights.
 */

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.css'],
  imports: [
    
    FormsModule,
    NgFor,
    NgIf,
    CommonModule,
    MatExpansionModule,
    HttpClientModule,
    MatDividerModule,
  ],
  providers: [HotelSearchService],
})
export class HotelSearchComponent {
  checkInDate!: string;
  noOfNights!: number;
  noOfNightsError: string = '';
  CheckInDateError: string = '';
  roomRequests: { noOfRooms: number; noOfAdults: number }[] = [];
  searchResults: any[] = [];
  errorMessage: string = '';
  isSearched = false;

  /**
   * Initializes the component and injects the HotelSearchService.
   *
   * @param hotelSearchService The service for interacting with the backend to fetch hotel data.
   */

  constructor(private hotelSearchService: HotelSearchService) {}

  addRoomRequest() {
    this.roomRequests.push({ noOfRooms: 1, noOfAdults: 1 });
  }

  removeRoomRequest(index: number) {
    this.roomRequests.splice(index, 1);
  }

  validateInputs() {
    const currentDate = new Date();
    const checkInDate = new Date(this.checkInDate);

    if (checkInDate < currentDate) {
      console.log('Check-in date cannot be in the past');
      this.CheckInDateError = 'Check-in date cannot be in the past';
    } else {
      this.CheckInDateError = '';
    }

    if (this.noOfNights < 1) {
      console.log('Number of nights must be greater than 0');
      this.noOfNightsError = 'Number of nights must be greater than 0';
    } else {
      this.noOfNightsError = '';
    }
  }

  /**
   * Calculates the total price for each hotel in the search results.
   * Assumes that `markedUpPrice` represents the price per room per night.
   */
  calculateTotalPrice() {
    this.searchResults.forEach((hotel) => {
      let totalPrice = 0;
      hotel.roomTypes.forEach((room: any) => {
        totalPrice += room.markedUpPrice; // Assuming the price is per night, multiply by number of nights
      });
      hotel.totalPrice = totalPrice;
      console.log(totalPrice); // Add the totalPrice to each hotel object
    });
  }

  /**
   * Performs the hotel search using the provided check-in date,
   * number of nights, and room requests. Handles success and error responses.
   */
  searchHotels() {
    this.validateInputs();
    if (this.CheckInDateError || this.noOfNightsError) {
      return;
    }
    const searchCriteria = {
      checkInDate: this.checkInDate,
      noOfNights: this.noOfNights,
      roomRequests: this.roomRequests,
    };

    this.hotelSearchService.searchHotels(searchCriteria).subscribe(
      (results) => {
        this.searchResults = results;
        this.calculateTotalPrice();

        console.log('Search Results:', results);

        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Error fetching data';
        this.searchResults = [];
      }
    );
  }
}
