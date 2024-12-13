import { Routes } from '@angular/router';
import { HomeComponent } from './homepage/home.component';
import { HotelContractComponent } from './hotel-contract/hotel-contract.component';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { viewContractsComponent } from './view-contracts/view-contracts.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hotel-contract', component: HotelContractComponent },
  { path: 'hotel-search', loadComponent: () => HotelSearchComponent },
  { path: 'view-contracts', component: viewContractsComponent },
];
