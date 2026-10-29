import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

interface EmployeeType {
  id?: number;
  code: string;
  name: string;
  status: boolean;
}

@Component({
  selector: 'app-employee-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="page">

      <!-- HEADER -->
      <div class="toolbar">

        <div>
          <h1>Employee Types</h1>
          <p>Manage employee types</p>
        </div>

        <button
          type="button"
          class="primary"
          (click)="openForm()">

          + Add Employee Type

        </button>

      </div>


      <!-- SEARCH -->
      <div class="card">

        <input
          type="text"
          class="search"
          [(ngModel)]="search"
          (input)="applySearch()"
          placeholder="Search by code or name..."
        />


        <!-- ERROR -->
        <div
          *ngIf="error"
          class="error">

          {{ error }}

        </div>


        <!-- TABLE -->
        <table
          *ngIf="filteredTypes.length > 0">

          <thead>

            <tr>

              <th>
                Code
              </th>

              <th>
                Employee Type
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            <tr
              *ngFor="let type of filteredTypes">

              <td>
                {{ type.code }}
              </td>

              <td>
                {{ type.name }}
              </td>

              <td>

                <span
                  class="status"
                  [class.active]="type.status"
                  [class.inactive]="!type.status">

                  {{
                    type.status
                      ? 'Active'
                      : 'Inactive'
                  }}

                </span>

              </td>

              <td>

                <button
                  type="button"
                  class="edit"
                  (click)="editType(type)">

                  Edit

                </button>

                <button
                  type="button"
                  class="delete"
                  (click)="deleteType(type)">

                  Delete

                </button>

              </td>

            </tr>

          </tbody>

        </table>


        <!-- EMPTY -->
        <div
          *ngIf="filteredTypes.length === 0"
          class="empty">

          No employee types found.

        </div>

      </div>


      <!-- FORM MODAL -->
      <div
        class="overlay"
        *ngIf="showForm">

        <div class="modal">

          <div class="modal-header">

            <h2>

              {{
                editingId
                  ? 'Edit Employee Type'
                  : 'Add Employee Type'
              }}

            </h2>

            <button
              type="button"
              class="close"
              (click)="closeForm()">

              ×

            </button>

          </div>


          <form
            #typeForm="ngForm"
            (ngSubmit)="save(typeForm)">


            <!-- CODE -->
            <div class="field">

              <label>
                Employee Type Code *
              </label>

              <input
                type="text"
                name="code"
                [(ngModel)]="form.code"
                required
                #code="ngModel"
                placeholder="Example: ET001"
              />

              <small
                *ngIf="
                  code.invalid &&
                  code.touched
                "
                class="validation">

                Employee Type Code is required.

              </small>

            </div>


            <!-- NAME -->
            <div class="field">

              <label>
                Employee Type Name *
              </label>

              <input
                type="text"
                name="name"
                [(ngModel)]="form.name"
                required
                #name="ngModel"
                placeholder="Example: Permanent"
              />

              <small
                *ngIf="
                  name.invalid &&
                  name.touched
                "
                class="validation">

                Employee Type Name is required.

              </small>

            </div>


            <!-- STATUS -->
            <div class="checkbox">

              <label>

                <input
                  type="checkbox"
                  name="status"
                  [(ngModel)]="form.status"
                />

                Active

              </label>

            </div>


            <!-- FORM ERROR -->
            <div
              *ngIf="formError"
              class="error">

              {{ formError }}

            </div>


            <!-- BUTTONS -->
            <div class="actions">

              <button
                type="button"
                class="secondary"
                (click)="closeForm()">

                Cancel

              </button>

              <button
                type="submit"
                class="primary"
                [disabled]="typeForm.invalid">

                {{
                  editingId
                    ? 'Update'
                    : 'Save'
                }}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  `,

  styles: [`

    .page {
      padding: 30px;
      min-height: 100vh;
      background: #f5f7fb;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
      color: #111827;
    }

    .toolbar p {
      margin: 5px 0 0;
      color: #6b7280;
    }

    .card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow:
        0 2px 10px
        rgba(0, 0, 0, 0.06);
    }

    .search {
      width: 100%;
      max-width: 450px;
      padding: 11px 13px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      margin-bottom: 20px;
      box-sizing: border-box;
    }

    .search:focus {
      outline: none;
      border-color: #2563eb;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 13px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      color: #374151;
    }

    td {
      padding: 13px;
      border-bottom: 1px solid #e5e7eb;
    }

    tr:hover {
      background: #f9fafb;
    }

    .primary {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 7px;
      padding: 10px 16px;
      cursor: pointer;
    }

    .primary:hover {
      background: #1d4ed8;
    }

    .primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .secondary {
      background: #e5e7eb;
      color: #374151;
      border: none;
      border-radius: 7px;
      padding: 10px 16px;
      cursor: pointer;
    }

    .edit {
      background: #dbeafe;
      color: #1d4ed8;
      border: none;
      border-radius: 6px;
      padding: 7px 12px;
      cursor: pointer;
      margin-right: 7px;
    }

    .delete {
      background: #fee2e2;
      color: #b91c1c;
      border: none;
      border-radius: 6px;
      padding: 7px 12px;
      cursor: pointer;
    }

    .status {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .active {
      background: #dcfce7;
      color: #166534;
    }

    .inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .error {
      background: #fee2e2;
      color: #991b1b;
      padding: 11px 14px;
      border-radius: 7px;
      margin-bottom: 15px;
    }

    .empty {
      text-align: center;
      padding: 30px;
      color: #6b7280;
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal {
      width: min(500px, 95vw);
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow:
        0 10px 30px
        rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-header h2 {
      margin: 0;
      color: #111827;
    }

    .close {
      border: none;
      background: transparent;
      font-size: 25px;
      cursor: pointer;
    }

    .field {
      margin-bottom: 18px;
    }

    .field label {
      display: block;
      font-weight: 600;
      margin-bottom: 7px;
      color: #374151;
    }

    .field input[type="text"] {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      box-sizing: border-box;
    }

    .field input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .validation {
      display: block;
      color: #dc2626;
      margin-top: 5px;
    }

    .checkbox {
      margin-bottom: 18px;
    }

    .checkbox label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 25px;
    }

    @media (max-width: 700px) {

      .page {
        padding: 15px;
      }

      .toolbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      table {
        display: block;
        overflow-x: auto;
      }

    }

  `]
})
export class EmployeeTypesComponent implements OnInit {

  api = inject(ApiService);

  types: EmployeeType[] = [];
  filteredTypes: EmployeeType[] = [];

  search = '';

  showForm = false;

  editingId: number | null = null;

  error = '';
  formError = '';

  form: EmployeeType = {
    code: '',
    name: '',
    status: true
  };


  ngOnInit(): void {

    this.loadTypes();

  }


  loadTypes(): void {

    this.error = '';

    this.api
      .get<any>('/employee-types/')
      .subscribe({

        next: (response) => {

          this.types =
            response.results ?? response;

          this.applySearch();

        },

        error: (err) => {

          console.error(
            'Employee Types loading error:',
            err
          );

          this.error =
            'Unable to load employee types.';

        }

      });

  }


  applySearch(): void {

    const value =
      this.search
        .trim()
        .toLowerCase();

    this.filteredTypes =
      this.types.filter(type =>

        type.code
          .toLowerCase()
          .includes(value)

        ||

        type.name
          .toLowerCase()
          .includes(value)

      );

  }


  openForm(): void {

    this.editingId = null;

    this.form = {
      code: '',
      name: '',
      status: true
    };

    this.formError = '';

    this.showForm = true;

  }


  editType(type: EmployeeType): void {

    this.editingId =
      type.id ?? null;

    this.form = {
      id: type.id,
      code: type.code,
      name: type.name,
      status: type.status
    };

    this.formError = '';

    this.showForm = true;

  }


  closeForm(): void {

    this.showForm = false;

    this.formError = '';

  }


  save(form: any): void {

    this.formError = '';

    if (form.invalid) {

      form.control.markAllAsTouched();

      return;

    }


    const code =
      this.form.code
        .trim();

    const name =
      this.form.name
        .trim();


    /*
     * DUPLICATE CODE
     */

    const duplicateCode =
      this.types.some(type =>

        type.code
          .trim()
          .toLowerCase()
        ===
        code.toLowerCase()

        &&

        type.id !==
        this.editingId

      );


    if (duplicateCode) {

      this.formError =
        `Employee Type code "${code}" already exists.`;

      return;

    }


    /*
     * DUPLICATE NAME
     */

    const duplicateName =
      this.types.some(type =>

        type.name
          .trim()
          .toLowerCase()
        ===
        name.toLowerCase()

        &&

        type.id !==
        this.editingId

      );


    if (duplicateName) {

      this.formError =
        `Employee Type name "${name}" already exists.`;

      return;

    }


    const data = {

      code: code,

      name: name,

      status: this.form.status

    };


    /*
     * UPDATE
     */

    if (this.editingId !== null) {

      this.api
        .put(
          '/employee-types/' +
          this.editingId +
          '/',
          data
        )
        .subscribe({

          next: () => {

            this.closeForm();

            this.loadTypes();

          },

          error: (err) => {

            console.error(
              'Employee Type update error:',
              err
            );

            this.handleError(err);

          }

        });

      return;

    }


    /*
     * CREATE
     */

    this.api
      .post(
        '/employee-types/',
        data
      )
      .subscribe({

        next: () => {

          this.closeForm();

          this.loadTypes();

        },

        error: (err) => {

          console.error(
            'Employee Type creation error:',
            err
          );

          this.handleError(err);

        }

      });

  }


  handleError(err: any): void {

    if (err.error?.code) {

      this.formError =
        Array.isArray(err.error.code)
          ? err.error.code[0]
          : err.error.code;

      return;

    }


    if (err.error?.name) {

      this.formError =
        Array.isArray(err.error.name)
          ? err.error.name[0]
          : err.error.name;

      return;

    }


    if (err.error?.detail) {

      this.formError =
        err.error.detail;

      return;

    }


    this.formError =
      'Unable to save employee type.';

  }


  deleteType(type: EmployeeType): void {

    const confirmed =
      confirm(
        `Are you sure you want to delete "${type.name}"?`
      );

    if (!confirmed) {
      return;
    }


    if (!type.id) {
      return;
    }


    this.api
      .delete(
        '/employee-types/' +
        type.id +
        '/'
      )
      .subscribe({

        next: () => {

          this.loadTypes();

        },

        error: (err) => {

          console.error(
            'Employee Type deletion error:',
            err
          );

          this.error =
            'Unable to delete employee type.';

        }

      });

  }

}