import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  HotelContractService,
  HotelContract,
} from '../services/hotel-contract.service';
import { HotelContractDto } from '../models/hotel-contract-dto.model';
import { FormsModule } from '@angular/forms';

/**
 * Component to manage and view hotel contracts.
 * It allows searching for contracts by ID, viewing details, and updating markup percentage.
 */
@Component({
  selector: 'app-hotel-contract',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './view-contracts.component.html',
  styleUrls: ['./view-contracts.component.css'],
})
export class viewContractsComponent {
  contractForm: FormGroup;
  contractId: number | null = null;
  contractDetails: HotelContractDto | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  /**
   * Constructor to inject dependencies and initialize the form group.
   *
   * @param fb FormBuilder service for creating reactive forms
   * @param contractService Service to interact with hotel contract APIs
   */
  constructor(
    private fb: FormBuilder,
    private contractService: HotelContractService
  ) {
    this.contractForm = this.fb.group({
      contractId: [null, Validators.required],
      hotelName: ['', Validators.required],
      contractValidFrom: ['', Validators.required],
      contractValidTo: ['', Validators.required],
      markupPercentage: [0, [Validators.required, Validators.min(0)]],
    });
  }

  /**
   * Fetches contract details by ID.
   * Populates the form with the fetched data if successful.
   */
  searchContract() {
    if (this.contractId !== null) {
      this.contractService.getContractById(this.contractId).subscribe({
        next: (data) => {
          this.contractDetails = data;
          this.contractForm.patchValue(data); // Bind contract data to form
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Contract not found or error fetching data.';
          this.contractDetails = null;
          this.errorMessage = 'Contract not found or error fetching data.'; // Clear any previous success message
        },
      });
    }
  }

  /**
   * Updates the markup percentage for the selected contract.
   * Displays success or error messages based on the API response.
   */
  updateMarkupPercentage() {
    if (this.contractId !== null && this.contractForm.valid) {
      const updatedMarkupPercentage =
        this.contractForm.get('markupPercentage')?.value;

      this.contractService
        .updateMarkupPercentage(this.contractId, updatedMarkupPercentage)
        .subscribe({
          next: (response) => {
            this.successMessage = 'Markup percentage updated successfully!';
            this.errorMessage = ''; // Clear error message if any
          },
          error: (error) => {
            this.errorMessage = 'Markup percentage updated successfully!';
            this.successMessage = ''; // Clear success message if any
          },
        });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.successMessage = ''; // Clear success message
    }
  }
}
