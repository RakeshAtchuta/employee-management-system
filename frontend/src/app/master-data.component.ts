import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface MasterItem {
  id?: number;
  code: string;
  name: string;
  status: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <div class="page">

      <div class="toolbar">
        <div>
          <h1>Master Data</h1>
          <p class="muted">
            Manage designations, employee types and locations
          </p>
        </div>
      </div>

      <!-- Master Data Type -->

      <div class="card selector-card">

        <label>Master Data Type</label>

        <select
          [(ngModel)]="selectedType"
          (change)="loadData()"
        >
          <option value="designations">Designations</option>
          <option value="employee-types">Employee Types</option>
          <option value="locations">Locations</option>
        </select>

      </div>

      <!-- List -->

      <div class="card">

        <div class="toolbar">

          <div>
            <h2>{{ title }}</h2>
          </div>

          <button
            class="primary"
            (click)="openForm()"
          >
            + Add {{ singularTitle }}
          </button>

        </div>

        <div class="search-row">

          <input
            type="text"
            [(ngModel)]="search"
            (input)="applySearch()"
            placeholder="Search by code or name..."
          />

        </div>

        <div
          *ngIf="loading"
          class="muted"
        >
          Loading...
        </div>

        <div
          *ngIf="error"
          class="error-box"
        >
          {{ error }}
        </div>

        <table
          *ngIf="!loading && filteredItems.length > 0"
        >

          <thead>

            <tr>

              <th (click)="sort('code')">
                Code ↕
              </th>

              <th (click)="sort('name')">
                Name ↕
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
              *ngFor="let item of pagedItems"
            >

              <td>
                {{ item.code }}
              </td>

              <td>
                {{ item.name }}
              </td>

              <td>

                <span
                  class="status"
                  [class.active]="item.status"
                  [class.inactive]="!item.status"
                >
                  {{ item.status ? 'Active' : 'Inactive' }}
                </span>

              </td>

              <td class="actions">

                <button
                  class="edit"
                  (click)="editItem(item)"
                >
                  Edit
                </button>

                <button
                  class="delete"
                  (click)="deleteItem(item)"
                >
                  Delete
                </button>

              </td>

            </tr>

          </tbody>

        </table>

        <div
          *ngIf="!loading && filteredItems.length === 0"
          class="empty"
        >
          No records found.
        </div>

        <div
          *ngIf="filteredItems.length > 0"
          class="pagination"
        >

          <button
            [disabled]="page === 1"
            (click)="page = page - 1"
          >
            Previous
          </button>

          <span>
            Page {{ page }} of {{ totalPages }}
          </span>

          <button
            [disabled]="page === totalPages"
            (click)="page = page + 1"
          >
            Next
          </button>

        </div>

      </div>

      <!-- Add / Edit -->

      <div
        class="overlay"
        *ngIf="showForm"
      >

        <div class="modal">

          <div class="modal-header">

            <h2>
              {{ editingId ? 'Edit' : 'Add' }}
              {{ singularTitle }}
            </h2>

            <button
              type="button"
              class="close"
              (click)="closeForm()"
            >
              ×
            </button>

          </div>

          <form
            (ngSubmit)="saveItem()"
          >

            <div class="field">

              <label>
                Code
              </label>

              <input
                type="text"
                name="code"
                [(ngModel)]="form.code"
                required
              />

            </div>

            <div class="field">

              <label>
                Name
              </label>

              <input
                type="text"
                name="name"
                [(ngModel)]="form.name"
                required
              />

            </div>

            <div class="field checkbox">

              <label>

                <input
                  type="checkbox"
                  name="status"
                  [(ngModel)]="form.status"
                />

                Active

              </label>

            </div>

            <div
              *ngIf="formError"
              class="error-box"
            >
              {{ formError }}
            </div>

            <div class="modal-actions">

              <button
                type="button"
                class="secondary"
                (click)="closeForm()"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="primary"
              >
                {{ editingId ? 'Update' : 'Save' }}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  `,

  styles: [`

    h1,
    h2 {
      margin-top: 0;
    }

    .selector-card {
      margin-bottom: 20px;
    }

    .selector-card label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .selector-card select {
      max-width: 400px;
    }

    .search-row {
      margin-bottom: 18px;
    }

    .search-row input {
      max-width: 400px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      background: #f9fafb;
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      cursor: pointer;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    .primary,
    .secondary,
    .edit,
    .delete,
    .pagination button,
    .close {
      border: none;
      border-radius: 7px;
      padding: 9px 14px;
      cursor: pointer;
    }

    .primary {
      background: #2563eb;
      color: white;
    }

    .secondary {
      background: #e5e7eb;
      color: #111827;
    }

    .edit {
      background: #e0f2fe;
      color: #0369a1;
      margin-right: 6px;
    }

    .delete {
      background: #fee2e2;
      color: #b91c1c;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .actions {
      white-space: nowrap;
    }

    .status {
      display: inline-block;
      padding: 4px 9px;
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

    .empty {
      text-align: center;
      padding: 30px;
      color: #6b7280;
    }

    .error-box {
      background: #fee2e2;
      color: #991b1b;
      padding: 10px;
      border-radius: 7px;
      margin-bottom: 15px;
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 15px;
      margin-top: 20px;
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: #00000066;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      width: min(500px, 90vw);
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 10px 30px #00000033;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-header h2 {
      margin: 0;
    }

    .close {
      background: transparent;
      font-size: 24px;
    }

    .field {
      margin-bottom: 16px;
    }

    .field label {
      display: block;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .checkbox label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .checkbox input {
      width: auto;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .muted {
      color: #6b7280;
    }

  `]
})
export class MasterDataComponent implements OnInit {

  private http = inject(HttpClient);

  private baseUrl =
    'http://127.0.0.1:8000/api/';

  selectedType = 'designations';

  items: MasterItem[] = [];

  filteredItems: MasterItem[] = [];

  search = '';

  loading = false;

  error = '';

  page = 1;

  pageSize = 5;

  sortField = '';

  sortDirection = 1;

  showForm = false;

  editingId: number | null = null;

  formError = '';

  form: MasterItem = {
    code: '',
    name: '',
    status: true
  };

  ngOnInit(): void {
    this.loadData();
  }

  get title(): string {

    if (this.selectedType === 'designations') {
      return 'Designations';
    }

    if (this.selectedType === 'employee-types') {
      return 'Employee Types';
    }

    return 'Locations';
  }

  get singularTitle(): string {

    if (this.selectedType === 'designations') {
      return 'Designation';
    }

    if (this.selectedType === 'employee-types') {
      return 'Employee Type';
    }

    return 'Location';
  }

  private headers(): HttpHeaders {

    const token =
      localStorage.getItem('access');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  }

  loadData(): void {

    this.loading = true;

    this.error = '';

    this.search = '';

    this.page = 1;

    this.items = [];

    this.filteredItems = [];

    this.http.get<any>(
      this.baseUrl + this.selectedType + '/',
      {
        headers: this.headers()
      }
    ).subscribe({

      next: (response) => {

        this.items =
          response.results ?? response;

        this.filteredItems =
          [...this.items];

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

        this.error =
          'Unable to load ' +
          this.title.toLowerCase() +
          '.';

      }

    });

  }

  applySearch(): void {

    const value =
      this.search.toLowerCase().trim();

    this.filteredItems =
      this.items.filter(item =>

        item.code
          .toLowerCase()
          .includes(value)

        ||

        item.name
          .toLowerCase()
          .includes(value)

      );

    this.page = 1;

  }

  sort(field: string): void {

    if (this.sortField === field) {

      this.sortDirection *= -1;

    } else {

      this.sortField = field;

      this.sortDirection = 1;

    }

    this.filteredItems.sort(
      (a: any, b: any) => {

        const valueA =
          String(a[field]).toLowerCase();

        const valueB =
          String(b[field]).toLowerCase();

        return (
          valueA.localeCompare(valueB)
          *
          this.sortDirection
        );

      }
    );

  }

  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(
        this.filteredItems.length /
        this.pageSize
      )
    );

  }

  get pagedItems(): MasterItem[] {

    const start =
      (this.page - 1) *
      this.pageSize;

    return this.filteredItems.slice(
      start,
      start + this.pageSize
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

  editItem(item: MasterItem): void {

    this.editingId =
      item.id ?? null;

    this.form = {

      code: item.code,

      name: item.name,

      status: item.status

    };

    this.formError = '';

    this.showForm = true;

  }

  closeForm(): void {

    this.showForm = false;

    this.formError = '';

  }

  saveItem(): void {

    this.formError = '';

    if (
      !this.form.code.trim()
      ||
      !this.form.name.trim()
    ) {

      this.formError =
        'Code and name are required.';

      return;

    }

    const url =
      this.baseUrl +
      this.selectedType +
      '/';

    if (this.editingId) {

      this.http.put(

        url + this.editingId + '/',

        this.form,

        {
          headers: this.headers()
        }

      ).subscribe({

        next: () => {

          this.closeForm();

          this.loadData();

        },

        error: (err) => {

          console.error(err);

          this.formError =
            'Unable to update record.';

        }

      });

    } else {

      this.http.post(

        url,

        this.form,

        {
          headers: this.headers()
        }

      ).subscribe({

        next: () => {

          this.closeForm();

          this.loadData();

        },

        error: (err) => {

          console.error(err);

          this.formError =
            'Unable to create record.';

        }

      });

    }

  }

  deleteItem(item: MasterItem): void {

    const confirmed =
      confirm(
        `Are you sure you want to delete "${item.name}"?`
      );

    if (!confirmed) {
      return;
    }

    const url =
      this.baseUrl +
      this.selectedType +
      '/' +
      item.id +
      '/';

    this.http.delete(

      url,

      {
        headers: this.headers()
      }

    ).subscribe({

      next: () => {

        this.loadData();

      },

      error: (err) => {

        console.error(err);

        this.error =
          'Unable to delete record.';

      }

    });

  }

}