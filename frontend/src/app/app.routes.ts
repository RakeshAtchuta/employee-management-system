import { Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';
import { EmployeesComponent } from './employees.component';
import { DepartmentsComponent } from './departments.component';
import { CompaniesComponent } from './companies.component';
import { EmployeeTypesComponent } from './employee-types.component';
import { DesignationsComponent } from './designations.component';
import { LocationsComponent } from './locations.component';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
    path: 'employees',
    component: EmployeesComponent
  },

  {
    path: 'departments',
    component: DepartmentsComponent
  },

  {
    path: 'companies',
    component: CompaniesComponent
  },

  {
    path: 'employee-types',
    component: EmployeeTypesComponent
  },

  {
    path: 'designations',
    component: DesignationsComponent
  },

  {
    path: 'locations',
    component: LocationsComponent
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];