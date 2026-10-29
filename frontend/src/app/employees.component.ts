import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import { ApiService } from './api.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-employees',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule
  ],

  templateUrl: './employees.component.html',

  styles: [`
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .field {
      margin-bottom: 15px;
    }

    .field input,
    .field select {
      width: 100%;
    }

    .error {
      color: #dc2626;
      font-size: 12px;
      margin-top: 4px;
    }

    .view-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 20px;
      padding: 10px 0;
    }

    .view-item {
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
    }

    .view-label {
      display: block;
      font-weight: 600;
      color: #555;
      margin-bottom: 4px;
    }

    .view-value {
      color: #111827;
    }

    @media (max-width: 700px) {
      .view-details {
        grid-template-columns: 1fr;
      }
    }
  `],

  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class EmployeesComponent implements OnInit {

  // =========================================================
  // SERVICES
  // =========================================================

  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);


  // =========================================================
  // DATA
  // =========================================================

  employees: any[] = [];

  departments: any[] = [];

  companies: any[] = [];

  designations: any[] = [];

  employeeTypes: any[] = [];

  locations: any[] = [];


  // =========================================================
  // SEARCH / LOADING
  // =========================================================

  search = '';

  loading = false;


  // =========================================================
  // ADD / EDIT DIALOG
  // =========================================================

  show = false;

  editing = false;

  editId: number | null = null;


  // =========================================================
  // VIEW DIALOG
  // =========================================================

  showView = false;

  selectedEmployee: any = null;


  // =========================================================
  // EMPLOYEE FORM
  // =========================================================

  form = this.fb.group({

    employee_id: [
      '',
      [
        Validators.required
      ]
    ],

    first_name: [
      '',
      [
        Validators.required
      ]
    ],

    last_name: [
      '',
      [
        Validators.required
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    mobile_number: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]
    ],

    gender: [
      'Male',
      [
        Validators.required
      ]
    ],

    date_of_birth: [
      '',
      [
        Validators.required
      ]
    ],

    date_of_joining: [
      '',
      [
        Validators.required
      ]
    ],

    department: [
      null,
      [
        Validators.required
      ]
    ],

    company: [
      null,
      [
        Validators.required
      ]
    ],

    designation: [
      null,
      [
        Validators.required
      ]
    ],

    employee_type: [
      null,
      [
        Validators.required
      ]
    ],

    location: [
      null,
      [
        Validators.required
      ]
    ],

    status: [
      'Active',
      [
        Validators.required
      ]
    ]

  });


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  ngOnInit(): void {

    this.load();

    this.loadDepartments();

    this.loadCompanies();

    this.loadDesignations();

    this.loadEmployeeTypes();

    this.loadLocations();

  }


  // =========================================================
  // LOAD EMPLOYEES
  // =========================================================

  load(): void {

    this.loading = true;

    this.api
      .get<any>(
        '/employees/?search=' +
        encodeURIComponent(this.search)
      )
      .subscribe({

        next: (response) => {

          /*
           * DRF can return either:
           *
           * 1. Direct array
           * 2. Paginated response:
           *    { count, next, previous, results }
           *
           * Support both formats.
           */

          if (Array.isArray(response)) {

            this.employees = response;

          } else if (response?.results) {

            this.employees = response.results;

          } else {

            this.employees = [];

          }

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Unable to load employees',
            error
          );

          this.employees = [];

          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to load employees.'
          });

        }

      });

  }


  // =========================================================
  // LOAD DEPARTMENTS
  // =========================================================

  loadDepartments(): void {

    this.api
      .get<any>(
        '/departments/'
      )
      .subscribe({

        next: (response) => {

          this.departments =
            Array.isArray(response)
              ? response
              : response?.results ?? [];

        },

        error: (error) => {

          console.error(
            'Unable to load departments',
            error
          );

          this.departments = [];

        }

      });

  }


  // =========================================================
  // LOAD COMPANIES
  // =========================================================

  loadCompanies(): void {

    this.api
      .get<any>(
        '/companies/'
      )
      .subscribe({

        next: (response) => {

          this.companies =
            Array.isArray(response)
              ? response
              : response?.results ?? [];

        },

        error: (error) => {

          console.error(
            'Unable to load companies',
            error
          );

          this.companies = [];

        }

      });

  }


  // =========================================================
  // LOAD DESIGNATIONS
  // =========================================================

  loadDesignations(): void {

    this.api
      .get<any>(
        '/designations/'
      )
      .subscribe({

        next: (response) => {

          this.designations =
            Array.isArray(response)
              ? response
              : response?.results ?? [];

        },

        error: (error) => {

          console.error(
            'Unable to load designations',
            error
          );

          this.designations = [];

        }

      });

  }


  // =========================================================
  // LOAD EMPLOYEE TYPES
  // =========================================================

  loadEmployeeTypes(): void {

    this.api
      .get<any>(
        '/employee-types/'
      )
      .subscribe({

        next: (response) => {

          this.employeeTypes =
            Array.isArray(response)
              ? response
              : response?.results ?? [];

        },

        error: (error) => {

          console.error(
            'Unable to load employee types',
            error
          );

          this.employeeTypes = [];

        }

      });

  }


  // =========================================================
  // LOAD LOCATIONS
  // =========================================================

  loadLocations(): void {

    this.api
      .get<any>(
        '/locations/'
      )
      .subscribe({

        next: (response) => {

          this.locations =
            Array.isArray(response)
              ? response
              : response?.results ?? [];

        },

        error: (error) => {

          console.error(
            'Unable to load locations',
            error
          );

          this.locations = [];

        }

      });

  }


  // =========================================================
  // SEARCH
  // =========================================================

  searchEmployees(): void {

    this.load();

  }


  // =========================================================
  // OPEN ADD EMPLOYEE DIALOG
  // =========================================================

  open(): void {

    this.editing = false;

    this.editId = null;

    this.clearServerErrors();

    this.form.reset({

      employee_id: '',

      first_name: '',

      last_name: '',

      email: '',

      mobile_number: '',

      gender: 'Male',

      date_of_birth: '',

      date_of_joining: '',

      department: null,

      company: null,

      designation: null,

      employee_type: null,

      location: null,

      status: 'Active'

    });

    this.form.markAsPristine();

    this.form.markAsUntouched();

    this.show = true;

  }


  // =========================================================
  // VIEW EMPLOYEE
  // =========================================================

  view(employee: any): void {

    this.selectedEmployee = employee;

    this.showView = true;

  }


  // =========================================================
  // CLOSE VIEW DIALOG
  // =========================================================

  closeView(): void {

    this.showView = false;

    this.selectedEmployee = null;

  }


  // =========================================================
  // EDIT EMPLOYEE
  // =========================================================

  edit(employee: any): void {

    this.editing = true;

    this.editId = employee.id;

    this.clearServerErrors();

    this.form.patchValue({

      employee_id: employee.employee_id,

      first_name: employee.first_name,

      last_name: employee.last_name,

      email: employee.email,

      mobile_number: employee.mobile_number,

      gender: employee.gender,

      date_of_birth: employee.date_of_birth,

      date_of_joining: employee.date_of_joining,

      department: employee.department,

      company: employee.company,

      designation: employee.designation,

      employee_type: employee.employee_type,

      location: employee.location,

      status: employee.status

    });

    this.form.markAsPristine();

    this.form.markAsUntouched();

    this.show = true;

  }


  // =========================================================
  // SAVE EMPLOYEE
  // =========================================================

  save(): void {

    this.clearServerErrors();

    // Validate form
    if (this.form.invalid) {

      this.form.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please correct the highlighted fields.'
      });

      return;

    }

    const employeeData = this.form.getRawValue();


    // =======================================================
    // EDIT
    // =======================================================

    if (
      this.editing &&
      this.editId !== null
    ) {

      this.api
        .put(
          '/employees/' +
          this.editId +
          '/',
          employeeData
        )
        .subscribe({

          next: () => {

            this.show = false;

            this.editing = false;

            this.editId = null;

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee updated successfully.'
            });

            this.load();

          },

          error: (error) => {

            this.handleSaveError(error);

          }

        });

      return;

    }


    // =======================================================
    // ADD
    // =======================================================

    this.api
      .post(
        '/employees/',
        employeeData
      )
      .subscribe({

        next: () => {

          this.show = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee added successfully.'
          });

          this.load();

        },

        error: (error) => {

          this.handleSaveError(error);

        }

      });

  }


  // =========================================================
  // HANDLE SAVE ERROR
  // =========================================================

  private handleSaveError(error: any): void {

    console.error(
      'Unable to save employee',
      error
    );


    // Duplicate Employee ID
    if (error.error?.employee_id) {

      this.form.controls.employee_id.setErrors({

        ...(this.form.controls.employee_id.errors || {}),

        duplicate: true

      });

      this.form.controls.employee_id.markAsTouched();

    }


    // Duplicate Email
    if (error.error?.email) {

      this.form.controls.email.setErrors({

        ...(this.form.controls.email.errors || {}),

        duplicate: true

      });

      this.form.controls.email.markAsTouched();

    }


    // Mobile validation error
    if (error.error?.mobile_number) {

      this.form.controls.mobile_number.setErrors({

        ...(this.form.controls.mobile_number.errors || {}),

        server: true

      });

      this.form.controls.mobile_number.markAsTouched();

    }


    // General validation error
    if (
      error.status === 400 &&
      !error.error?.employee_id &&
      !error.error?.email &&
      !error.error?.mobile_number
    ) {

      this.form.markAllAsTouched();

    }


    let detail = 'Unable to save employee.';

    if (error.status === 400) {

      detail =
        'Please check the entered employee details.';

    } else if (error.status === 401) {

      detail =
        'Your session has expired. Please login again.';

    } else if (error.status >= 500) {

      detail =
        'Server error. Please try again later.';

    }

    this.messageService.add({
      severity: 'error',
      summary: 'Save Failed',
      detail
    });

  }


  // =========================================================
  // CLEAR SERVER ERRORS
  // =========================================================

  private clearServerErrors(): void {

    const employeeIdErrors =
      this.form.controls.employee_id.errors;

    if (employeeIdErrors?.['duplicate']) {

      const {
        duplicate,
        ...remaining
      } = employeeIdErrors;

      this.form.controls.employee_id.setErrors(
        Object.keys(remaining).length
          ? remaining
          : null
      );

    }


    const emailErrors =
      this.form.controls.email.errors;

    if (emailErrors?.['duplicate']) {

      const {
        duplicate,
        ...remaining
      } = emailErrors;

      this.form.controls.email.setErrors(
        Object.keys(remaining).length
          ? remaining
          : null
      );

    }


    const mobileErrors =
      this.form.controls.mobile_number.errors;

    if (mobileErrors?.['server']) {

      const {
        server,
        ...remaining
      } = mobileErrors;

      this.form.controls.mobile_number.setErrors(
        Object.keys(remaining).length
          ? remaining
          : null
      );

    }

  }


  // =========================================================
  // DELETE EMPLOYEE
  // =========================================================

  remove(id: number): void {

    this.confirmationService.confirm({

      message:
        'Are you sure you want to delete this employee?',

      header:
        'Confirm Delete',

      icon:
        'pi pi-exclamation-triangle',

      acceptLabel:
        'Yes, Delete',

      rejectLabel:
        'Cancel',

      acceptButtonStyleClass:
        'p-button-danger',

      rejectButtonStyleClass:
        'p-button-secondary',

      accept: () => {

        this.api
          .delete(
            '/employees/' +
            id +
            '/'
          )
          .subscribe({

            next: () => {

              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Employee deleted successfully.'
              });

              this.load();

            },

            error: (error) => {

              console.error(
                'Unable to delete employee',
                error
              );

              this.messageService.add({
                severity: 'error',
                summary: 'Delete Failed',
                detail:
                  'Unable to delete employee.'
              });

            }

          });

      }

    });

  }

}