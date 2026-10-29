import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Department {
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
          <h1>Departments</h1>
          <p class="muted">Manage departments</p>
        </div>

        <button class="primary" (click)="openForm()">
          + Add Department
        </button>
      </div>

      <div class="card">

        <div class="search-row">
          <input
            type="text"
            [(ngModel)]="search"
            (input)="applySearch()"
            placeholder="Search by code or name..."
          />
        </div>

        <div *ngIf="loading" class="muted">
          Loading departments...
        </div>

        <div *ngIf="error" class="error-box">
          {{ error }}
        </div>

        <table *ngIf="!loading && filteredDepartments.length > 0">
          <thead>
            <tr>
              <th (click)="sort('code')">Code ↕</th>
              <th (click)="sort('name')">Department Name ↕</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let department of pagedDepartments">
              <td>{{ department.code }}</td>
              <td>{{ department.name }}</td>

              <td>
                <span
                  [class.active]="department.status"
                  [class.inactive]="!department.status"
                  class="status"
                >
                  {{ department.status ? 'Active' : 'Inactive' }}
                </span>
              </td>

              <td class="actions">
                <button class="edit" (click)="editDepartment(department)">
                  Edit
                </button>

                <button class="delete" (click)="deleteDepartment(department)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          *ngIf="!loading && filteredDepartments.length === 0"
          class="empty"
        >
          No departments found.
        </div>

        <div
          *ngIf="filteredDepartments.length > 0"
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

      <!-- Add / Edit Form -->

      <div class="overlay" *ngIf="showForm">

        <div class="modal">

          <div class="modal-header">
            <h2>
              {{ editingId ? 'Edit Department' : 'Add Department' }}
            </h2>

            <button class="close" (click)="closeForm()">×</button>
          </div>

          <form (ngSubmit)="saveDepartment()">

            <div class="field">
              <label>Department Code</label>
              <input
                type="text"
                name="code"
                [(ngModel)]="form.code"
                required
              />
            </div>

            <div class="field">
              <label>Department Name</label>
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

            <div *ngIf="formError" class="error-box">
              {{ formError }}
            </div>

            <div class="modal-actions">
              <button type="button" class="secondary" (click)="closeForm()">
                Cancel
              </button>

              <button type="submit" class="primary">
                {{ editingId ? 'Update' : 'Save' }}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  `,

  styles: [`
    h1 {
      margin: 0;
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

    @media(max-width: 700px) {
      table {
        font-size: 13px;
      }

      .actions {
        white-space: normal;
      }
    }
  `]
})
export class DepartmentsComponent implements OnInit {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/api/departments/';

  departments: Department[] = [];
  filteredDepartments: Department[] = [];

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

  form: Department = {
    code: '',
    name: '',
    status: true
  };

  ngOnInit(): void {
    this.loadDepartments();
  }

  private headers(): HttpHeaders {
    const token = localStorage.getItem('access');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  loadDepartments(): void {
    this.loading = true;
    this.error = '';

    this.http.get<any>(this.apiUrl, {
      headers: this.headers()
    }).subscribe({
      next: (response) => {
        this.departments = response.results ?? response;
        this.filteredDepartments = [...this.departments];
        this.loading = false;
        this.applySearch();
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Unable to load departments.';
      }
    });
  }

  applySearch(): void {
    const value = this.search.toLowerCase().trim();

    this.filteredDepartments = this.departments.filter(d =>
      d.code.toLowerCase().includes(value) ||
      d.name.toLowerCase().includes(value)
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

    this.filteredDepartments.sort((a: any, b: any) => {
      const valueA = String(a[field]).toLowerCase();
      const valueB = String(b[field]).toLowerCase();

      return valueA.localeCompare(valueB) * this.sortDirection;
    });
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredDepartments.length / this.pageSize)
    );
  }

  get pagedDepartments(): Department[] {
    const start = (this.page - 1) * this.pageSize;

    return this.filteredDepartments.slice(
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

  editDepartment(department: Department): void {
    this.editingId = department.id ?? null;

    this.form = {
      code: department.code,
      name: department.name,
      status: department.status
    };

    this.formError = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.formError = '';
  }

  saveDepartment(): void {
    this.formError = '';

    if (!this.form.code.trim() || !this.form.name.trim()) {
      this.formError = 'Department code and name are required.';
      return;
    }

    if (this.editingId) {

      this.http.put(
        `${this.apiUrl}${this.editingId}/`,
        this.form,
        { headers: this.headers() }
      ).subscribe({
        next: () => {
          this.closeForm();
          this.loadDepartments();
        },

        error: (err) => {
          console.error(err);
          this.formError = 'Unable to update department.';
        }
      });

    } else {

      this.http.post(
        this.apiUrl,
        this.form,
        { headers: this.headers() }
      ).subscribe({
        next: () => {
          this.closeForm();
          this.loadDepartments();
        },

        error: (err) => {
          console.error(err);
          this.formError = 'Unable to create department.';
        }
      });

    }
  }

  deleteDepartment(department: Department): void {

    const confirmed = confirm(
      `Are you sure you want to delete "${department.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.http.delete(
      `${this.apiUrl}${department.id}/`,
      { headers: this.headers() }
    ).subscribe({
      next: () => {
        this.loadDepartments();
      },

      error: (err) => {
        console.error(err);
        this.error = 'Unable to delete department.';
      }
    });
  }
}