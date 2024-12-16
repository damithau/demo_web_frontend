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
  minimumOneRoomValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const formArray = control as FormArray;
    return formArray.length > 0 ? null : { noRoomTypes: true };
  }

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
