

import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelContractService, HotelContract } from '../services/hotel-contract.service';
import { HotelContractDto } from '../models/hotel-contract-dto.model';
import { FormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder, private contractService: HotelContractService) {
    this.contractForm = this.fb.group({
      hotelName: ['', Validators.required],
      contractValidFrom: ['', Validators.required],
      contractValidTo: ['', Validators.required],
      markupPercentage: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // Fetch contract by ID
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
        }
      });
    }
  }

  // Update markup percentage
  // updateMarkupPercentage() {
  //   if (this.contractId !== null && this.contractForm.valid) {
  //     const updatedMarkupPercentage = this.contractForm.get('markupPercentage')?.value;
      
  //     this.contractService.updateMarkupPercentage(this.contractId, updatedMarkupPercentage).subscribe({
  //       next: (response) => {
  //         this.successMessage = 'Markup percentage updated successfully!';
          
  //       },
  //       error: (error) => {
  //         this.errorMessage = 'Error updating markup percentage: ' + error.message;
  //         this.successMessage = ''; // Clear success message
  //       }
  //     });
  //   }
  // }
  updateMarkupPercentage() {
    if (this.contractId !== null && this.contractForm.valid) {
      const updatedMarkupPercentage = this.contractForm.get('markupPercentage')?.value;
  
      this.contractService.updateMarkupPercentage(this.contractId, updatedMarkupPercentage).subscribe({
        next: (response) => {
          this.successMessage = 'Markup percentage updated successfully!';
          this.errorMessage = ''; // Clear error message if any
        },
        error: (error) => {
          this.errorMessage = 'Markup percentage updated successfully!';
          this.successMessage = ''; // Clear success message if any
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.successMessage = ''; // Clear success message
    }
  }
  
}
