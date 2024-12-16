import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  NgModel,
  ValidationErrors,
} from '@angular/forms';
import {
  HotelContractService,
  HotelContract,
} from '../services/hotel-contract.service';
import { HotelContractDto } from '../models/hotel-contract-dto.model';
import { FormsModule } from '@angular/forms';

/**
 * The HotelContractComponent provides functionality to create, validate,
 * and submit hotel contracts, as well as fetch existing contracts by ID.
 * It is a standalone component, using Angular's reactive forms
 * for robust form handling and validation.
 */
@Component({
  selector: 'app-hotel-contract',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './hotel-contract.component.html',
  styleUrls: ['./hotel-contract.component.css'],
})
export class HotelContractComponent {
  contractForm: FormGroup;
  contractId: number | null = null;
  contractDetails: HotelContractDto | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private contractService: HotelContractService
  ) {
    this.contractForm = this.fb.group(
      {
        hotelName: ['', Validators.required],
        contractValidFrom: ['', Validators.required],
        contractValidTo: ['', Validators.required],
        markupPercentage: [0, [Validators.required, Validators.min(1)]],
        roomTypes: this.fb.array([], this.minimumOneRoomValidator),
      },
      { validators: this.dateRangeValidator }
    );
  }

   /**
   * Searches for a hotel contract by its ID and fetches its details.
   * Displays an error message if the contract is not found.
   */

  searchContract() {
    if (this.contractId !== null) {
      this.contractService.getContractById(this.contractId).subscribe({
        next: (data) => {
          this.contractDetails = data;
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Contract not found or error fetching data.';
          this.contractDetails = null;
        },
      });
    }
  }

  get roomTypes(): FormArray {
    return this.contractForm.get('roomTypes') as FormArray;
  }

  addRoomType(): void {
    this.roomTypes.push(
      this.fb.group({
        roomType: ['', Validators.required],
        pricePerPerson: [0, [Validators.required, Validators.min(0)]],
        amountOfRooms: [0, [Validators.required, Validators.min(1)]],
        maxAdults: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeRoomType(index: number): void {
    this.roomTypes.removeAt(index);
  }

  /**
   * Submits the hotel contract form if valid.
   * Sends the form data to the backend and handles success or error responses.
   */

  submit(): void {
    if (this.contractForm.valid) {
      const contractData = this.contractForm.value;

      this.contractService.submitContract(contractData).subscribe(
        (response) => {
          console.log('Contract submitted successfully:', response);

          // Reset the form after successful submission
          this.contractForm.reset();
          this.roomTypes.clear(); // Clear room types
        },
        (error) => {
          console.error('Error submitting contract:', error);
        }
      );
    } else {
      // Mark roomTypes as touched to trigger the inline error message
      this.contractForm.get('roomTypes')?.markAsTouched();

      return;
    }
  }

  /**
   * Validator to ensure at least one room type is added.
   * 
   * @param control The AbstractControl representing the 'roomTypes' FormArray.
   * @returns {ValidationErrors | null} An error object if validation fails, otherwise null.
   */
  minimumOneRoomValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const formArray = control as FormArray;
    return formArray.length > 0 ? null : { noRoomTypes: true };
  }

  /**
   * Custom validator to ensure 'contractValidFrom' is earlier than 'contractValidTo'.
   * 
   * @param control The AbstractControl representing the form group.
   * @returns {ValidationErrors | null} An error object if validation fails, otherwise null.
   */

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const from = control.get('contractValidFrom')?.value;
    const to = control.get('contractValidTo')?.value;

    if (from && to && new Date(from) >= new Date(to)) {
      control.get('contractValidFrom')?.setErrors({ invalidDateRange: true });
      control.get('contractValidTo')?.setErrors({ invalidDateRange: true });
      return { dateRangeInvalid: true };
    } else {
      control.get('contractValidFrom')?.setErrors(null);
      control.get('contractValidTo')?.setErrors(null);
    }
    return null;
  }

  /**
   * Retrieves a human-readable error message for a specific form control.
   * 
   * @param control The form control to check for errors.
   * @param fieldName The name of the field for contextual error messages.
   * @returns {string} The error message if validation fails, otherwise an empty string.
   */
  
  getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `${fieldName} is required.`;
    }

    if (control.errors['min']) {
      return `${fieldName} must be at least ${control.errors['min'].min}.`;
    }

    if (control.errors['invalidDateRange']) {
      return `Contract Valid From must be earlier than Contract Valid To.`;
    }

    if (control.errors['noRoomTypes']) {
      return 'At least one room type is required.';
    }

    return '';
  }
}
