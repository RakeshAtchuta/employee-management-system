import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';

interface Designation {
  id?: number;
  code: string;
  name: string;
  status: boolean;
}

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  template: `
    <div class="page-layout">

      <!-- SIDEBAR -->
      <aside class="sidebar">

        <div class="brand">
          <div class="brand-icon">EM</div>
          <div>
            <div class="brand-title">Employee</div>
            <div class="brand-subtitle">Management</div>
          </div>
        </div>

        <div class="menu-title">MAIN MENU</div>

        <nav class="menu">

          <a routerLink="/dashboard" class="menu-item">
            <span class="icon">⌂</span>
            <span>Dashboard</span>
          </a>

          <a routerLink="/employees" class="menu-item">
            <span class="icon">👥</span>
            <span>Employees</span>
          </a>

          <a routerLink="/departments" class="menu-item">
            <span class="icon">▦</span>
            <span>Departments</span>
          </a>

          <a routerLink="/companies" class="menu-item">
            <span class="icon">▣</span>
            <span>Companies</span>
          </a>

        </nav>

        <div class="menu-title">
          MASTER DATA
        </div>

        <nav class="menu">

          <a routerLink="/employee-types" class="menu-item">
            <span class="icon">◈</span>
            <span>Employee Types</span>
          </a>

          <a
            routerLink="/designations"
            class="menu-item active"
          >
            <span class="icon">◆</span>
            <span>Designations</span>
          </a>

          <a routerLink="/locations" class="menu-item">
            <span class="icon">⌖</span>
            <span>Locations</span>
          </a>

        </nav>

        <div class="sidebar-bottom">

          <button
            type="button"
            class="logout-button"
            (click)="logout()"
          >
            <span class="icon">↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>


      <!-- MAIN -->
      <main class="main-content">

        <!-- TOP BAR -->
        <header class="topbar">

          <div>
            <h2>Designations</h2>
            <p>Manage employee designations</p>
          </div>

          <div class="user-area">

            <div class="user-avatar">
              A
            </div>

            <div class="user-text">
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>


        <!-- CONTENT -->
        <section class="content">

          <div class="page-header">

            <div>
              <h3>Designation Management</h3>
              <p>
                Add, edit, search and manage designations.
              </p>
            </div>

            <button
              type="button"
              class="primary-button"
              (click)="openAdd()"
            >
              + Add Designation
            </button>

          </div>


          <!-- ERROR -->
          <div
            *ngIf="error"
            class="message error-message"
          >
            {{ error }}
          </div>


          <!-- SUCCESS -->
          <div
            *ngIf="success"
            class="message success-message"
          >
            {{ success }}
          </div>


          <!-- SEARCH -->
          <div class="toolbar">

            <input
              type="text"
              [(ngModel)]="search"
              (input)="filterDesignations()"
              placeholder="Search by code or designation name..."
              class="search-input"
            />

            <button
              type="button"
              class="refresh-button"
              (click)="loadDesignations()"
            >
              ↻ Refresh
            </button>

          </div>


          <!-- TABLE -->
          <div class="table-container">

            <table>

              <thead>

                <tr>
                  <th>#</th>
                  <th>Code</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                <tr
                  *ngFor="
                    let designation of filteredDesignations;
                    let i = index
                  "
                >

                  <td>
                    {{ i + 1 }}
                  </td>

                  <td>
                    <strong>
                      {{ designation.code }}
                    </strong>
                  </td>

                  <td>
                    {{ designation.name }}
                  </td>

                  <td>

                    <span
                      class="status"
                      [class.active]="designation.status"
                      [class.inactive]="!designation.status"
                    >
                      {{
                        designation.status
                          ? 'Active'
                          : 'Inactive'
                      }}
                    </span>

                  </td>

                  <td>

                    <div class="actions">

                      <button
                        type="button"
                        class="edit-button"
                        (click)="openEdit(designation)"
                      >
                        ✎ Edit
                      </button>

                      <button
                        type="button"
                        class="delete-button"
                        (click)="deleteDesignation(designation)"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </td>

                </tr>


                <tr
                  *ngIf="filteredDesignations.length === 0"
                >
                  <td
                    colspan="5"
                    class="empty"
                  >
                    No designations found.
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>


    <!-- ADD / EDIT MODAL -->
    <div
      *ngIf="showModal"
      class="modal-backdrop"
    >

      <div class="modal">

        <div class="modal-header">

          <div>
            <h3>
              {{
                editing
                  ? 'Edit Designation'
                  : 'Add Designation'
              }}
            </h3>

            <p>
              Enter designation information.
            </p>
          </div>

          <button
            type="button"
            class="close-button"
            (click)="closeModal()"
          >
            ×
          </button>

        </div>


        <div class="modal-body">

          <div class="form-group">

            <label>
              Code <span>*</span>
            </label>

            <input
              type="text"
              [(ngModel)]="form.code"
              placeholder="Example: DES001"
            />

          </div>


          <div class="form-group">

            <label>
              Designation Name <span>*</span>
            </label>

            <input
              type="text"
              [(ngModel)]="form.name"
              placeholder="Example: Software Developer"
            />

          </div>


          <div class="form-group">

            <label>Status</label>

            <select
              [(ngModel)]="form.status"
            >

              <option [ngValue]="true">
                Active
              </option>

              <option [ngValue]="false">
                Inactive
              </option>

            </select>

          </div>


          <div
            *ngIf="formError"
            class="form-error"
          >
            {{ formError }}
          </div>

        </div>


        <div class="modal-footer">

          <button
            type="button"
            class="cancel-button"
            (click)="closeModal()"
          >
            Cancel
          </button>

          <button
            type="button"
            class="save-button"
            (click)="save()"
          >
            {{ editing ? 'Update' : 'Save' }}
          </button>

        </div>

      </div>

    </div>
  `,

  styles: [`

    * {
      box-sizing: border-box;
    }

    .page-layout {
      min-height: 100vh;
      display: flex;
      background: #f5f7fb;
      color: #1f2937;
    }

    .sidebar {
      width: 250px;
      min-height: 100vh;
      background: #111827;
      color: white;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .brand {
      height: 82px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 20px;
      border-bottom: 1px solid #273244;
    }

    .brand-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .brand-title {
      font-size: 16px;
      font-weight: 700;
    }

    .brand-subtitle {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 2px;
    }

    .menu-title {
      font-size: 11px;
      font-weight: 700;
      color: #6b7280;
      padding: 24px 20px 10px;
      letter-spacing: 0.08em;
    }

    .menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 12px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 45px;
      padding: 0 13px;
      border-radius: 8px;
      color: #d1d5db;
      text-decoration: none;
      font-size: 14px;
    }

    .menu-item:hover {
      background: #1f2937;
      color: white;
    }

    .menu-item.active {
      background: #2563eb;
      color: white;
      font-weight: 600;
    }

    .icon {
      width: 22px;
      text-align: center;
      flex-shrink: 0;
    }

    .sidebar-bottom {
      margin-top: auto;
      padding: 18px 12px;
      border-top: 1px solid #273244;
    }

    .logout-button {
      width: 100%;
      height: 43px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #d1d5db;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 13px;
      font-size: 14px;
    }

    .logout-button:hover {
      background: #1f2937;
      color: white;
    }

    .main-content {
      flex: 1;
      min-width: 0;
    }

    .topbar {
      height: 82px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
    }

    .topbar h2 {
      margin: 0;
      font-size: 22px;
      color: #111827;
    }

    .topbar p {
      margin: 4px 0 0;
      color: #6b7280;
      font-size: 13px;
    }

    .user-area {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .user-text {
      display: flex;
      flex-direction: column;
    }

    .user-text strong {
      font-size: 13px;
    }

    .user-text span {
      color: #6b7280;
      font-size: 11px;
    }

    .content {
      padding: 30px;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .page-header h3 {
      margin: 0;
      font-size: 22px;
    }

    .page-header p {
      margin: 6px 0 0;
      color: #6b7280;
      font-size: 13px;
    }

    .primary-button {
      border: none;
      background: #2563eb;
      color: white;
      padding: 11px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .primary-button:hover {
      background: #1d4ed8;
    }

    .message {
      padding: 12px 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .error-message {
      background: #fee2e2;
      color: #991b1b;
    }

    .success-message {
      background: #dcfce7;
      color: #166534;
    }

    .toolbar {
      background: white;
      border: 1px solid #e5e7eb;
      padding: 15px;
      border-radius: 10px 10px 0 0;
      display: flex;
      gap: 10px;
    }

    .search-input {
      flex: 1;
      height: 42px;
      border: 1px solid #d1d5db;
      border-radius: 7px;
      padding: 0 13px;
      font-size: 14px;
      outline: none;
    }

    .search-input:focus {
      border-color: #2563eb;
    }

    .refresh-button {
      height: 42px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 7px;
      padding: 0 16px;
      cursor: pointer;
    }

    .table-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 10px 10px;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #f9fafb;
      color: #374151;
      font-size: 12px;
      text-align: left;
      padding: 14px 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    td {
      padding: 15px 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
    }

    .status {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }

    .status.active {
      background: #dcfce7;
      color: #166534;
    }

    .status.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .actions {
      display: flex;
      gap: 7px;
    }

    .edit-button,
    .delete-button {
      border: none;
      border-radius: 6px;
      padding: 7px 10px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
    }

    .edit-button {
      background: #eff6ff;
      color: #2563eb;
    }

    .delete-button {
      background: #fef2f2;
      color: #dc2626;
    }

    .empty {
      text-align: center;
      padding: 35px;
      color: #9ca3af;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 1000;
    }

    .modal {
      width: 100%;
      max-width: 500px;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
    }

    .modal-header p {
      margin: 5px 0 0;
      color: #6b7280;
      font-size: 12px;
    }

    .close-button {
      border: none;
      background: transparent;
      font-size: 25px;
      cursor: pointer;
    }

    .modal-body {
      padding: 20px;
    }

    .form-group {
      margin-bottom: 17px;
    }

    .form-group label {
      display: block;
      margin-bottom: 7px;
      font-size: 13px;
      font-weight: 600;
    }

    .form-group label span {
      color: #dc2626;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      height: 42px;
      border: 1px solid #d1d5db;
      border-radius: 7px;
      padding: 0 12px;
      font-size: 14px;
      outline: none;
      background: white;
    }

    .form-error {
      background: #fee2e2;
      color: #991b1b;
      padding: 10px;
      border-radius: 7px;
      font-size: 13px;
    }

    .modal-footer {
      padding: 15px 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .cancel-button,
    .save-button {
      height: 40px;
      border-radius: 7px;
      padding: 0 18px;
      cursor: pointer;
      font-weight: 600;
    }

    .cancel-button {
      background: white;
      border: 1px solid #d1d5db;
    }

    .save-button {
      background: #2563eb;
      color: white;
      border: none;
    }

    @media (max-width: 800px) {

      .sidebar {
        width: 70px;
      }

      .brand {
        justify-content: center;
        padding: 15px 8px;
      }

      .brand > div:last-child,
      .menu-title,
      .menu-item span:last-child,
      .logout-button span:last-child,
      .user-text {
        display: none;
      }

      .menu-item {
        justify-content: center;
        padding: 0;
      }

      .page-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .toolbar {
        flex-direction: column;
      }

      .actions {
        flex-direction: column;
      }
    }

  `]
})


export class DesignationsComponent implements OnInit {

  api = inject(ApiService);

  designations: Designation[] = [];

  filteredDesignations: Designation[] = [];

  search = '';

  showModal = false;

  editing = false;

  formError = '';

  error = '';

  success = '';

  form: Designation = {
    code: '',
    name: '',
    status: true
  };


  ngOnInit(): void {
    this.loadDesignations();
  }


  loadDesignations(): void {

    this.error = '';

    this.api
      .get<any>('/designations/')
      .subscribe({

        next: (response) => {

          this.designations =
            Array.isArray(response)
              ? response
              : response.results || [];

          this.filterDesignations();
        },

        error: (err) => {

          console.error(
            'Designation loading error:',
            err
          );

          this.error =
            'Unable to load designations.';
        }

      });

  }


  filterDesignations(): void {

    const value =
      this.search.trim().toLowerCase();

    if (!value) {

      this.filteredDesignations =
        [...this.designations];

      return;
    }

    this.filteredDesignations =
      this.designations.filter(
        designation =>
          designation.code
            .toLowerCase()
            .includes(value)
          ||
          designation.name
            .toLowerCase()
            .includes(value)
      );

  }


  openAdd(): void {

    this.editing = false;

    this.formError = '';

    this.error = '';

    this.success = '';

    this.form = {
      code: '',
      name: '',
      status: true
    };

    this.showModal = true;
  }


  openEdit(
    designation: Designation
  ): void {

    this.editing = true;

    this.formError = '';

    this.error = '';

    this.success = '';

    this.form = {
      id: designation.id,
      code: designation.code,
      name: designation.name,
      status: designation.status
    };

    this.showModal = true;
  }


  closeModal(): void {

    this.showModal = false;

    this.formError = '';
  }


  save(): void {

    this.formError = '';

    this.error = '';

    this.success = '';

    const code =
      this.form.code.trim();

    const name =
      this.form.name.trim();


    if (!code) {

      this.formError =
        'Designation code is required.';

      return;
    }


    if (!name) {

      this.formError =
        'Designation name is required.';

      return;
    }


    const duplicateCode =
      this.designations.some(
        designation =>
          designation.code
            .trim()
            .toLowerCase()
            === code.toLowerCase()
          &&
          designation.id !== this.form.id
      );


    if (duplicateCode) {

      this.formError =
        `Designation code "${code}" already exists.`;

      return;
    }


    const duplicateName =
      this.designations.some(
        designation =>
          designation.name
            .trim()
            .toLowerCase()
            === name.toLowerCase()
          &&
          designation.id !== this.form.id
      );


    if (duplicateName) {

      this.formError =
        `Designation name "${name}" already exists.`;

      return;
    }


    const data = {
      code,
      name,
      status: this.form.status
    };


    if (
      this.editing &&
      this.form.id
    ) {

      this.api
        .put<any>(
          `/designations/${this.form.id}/`,
          data
        )
        .subscribe({

          next: () => {

            this.success =
              'Designation updated successfully.';

            this.closeModal();

            this.loadDesignations();
          },

          error: (err) => {

            console.error(
              'Designation update error:',
              err
            );

            this.formError =
              this.getBackendError(
                err,
                'Unable to update designation.'
              );
          }

        });

      return;
    }


    this.api
      .post<any>(
        '/designations/',
        data
      )
      .subscribe({

        next: () => {

          this.success =
            'Designation created successfully.';

          this.closeModal();

          this.loadDesignations();
        },

        error: (err) => {

          console.error(
            'Designation create error:',
            err
          );

          this.formError =
            this.getBackendError(
              err,
              'Unable to create designation.'
            );
        }

      });

  }


  deleteDesignation(
    designation: Designation
  ): void {

    if (!designation.id) {
      return;
    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${designation.name}"?`
      );


    if (!confirmed) {
      return;
    }


    this.api
      .delete<any>(
        `/designations/${designation.id}/`
      )
      .subscribe({

        next: () => {

          this.success =
            'Designation deleted successfully.';

          this.loadDesignations();
        },

        error: (err) => {

          console.error(
            'Designation delete error:',
            err
          );

          this.error =
            this.getBackendError(
              err,
              'Unable to delete designation.'
            );
        }

      });

  }


  getBackendError(
    err: any,
    fallback: string
  ): string {

    const data = err?.error;

    if (!data) {
      return fallback;
    }

    if (typeof data === 'string') {
      return data;
    }

    if (data.detail) {
      return data.detail;
    }

    if (
      data.code &&
      Array.isArray(data.code)
    ) {
      return data.code[0];
    }

    if (
      data.name &&
      Array.isArray(data.name)
    ) {
      return data.name[0];
    }

    return fallback;
  }


  logout(): void {

    localStorage.removeItem('access');

    localStorage.removeItem('refresh');

    window.location.href = '/login';
  }

}