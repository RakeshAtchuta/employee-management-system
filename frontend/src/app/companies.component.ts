import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

interface Company {
  id?: number;
  code: string;
  name: string;
  address: string;
  contact_information: string;
  status: boolean;
}

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-companies',
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
          <h1>Companies</h1>
          <p class="muted">Manage companies</p>
        </div>

        <button
          type="button"
          class="primary"
          (click)="openForm()">
          + Add Company
        </button>
      </div>

      <!-- COMPANY LIST -->
      <div class="card">

        <!-- SEARCH -->
        <div class="search-row">
          <input
            type="text"
            [(ngModel)]="search"
            (input)="applySearch()"
            placeholder="Search by code, name or contact..."
          />
        </div>

        <!-- ERROR -->
        <div
          *ngIf="error"
          class="error-box">
          {{ error }}
        </div>

        <!-- LOADING -->
        <div
          *ngIf="loading"
          class="muted loading">
          Loading companies...
        </div>

        <!-- TABLE -->
        <table
          *ngIf="
            !loading &&
            filteredCompanies.length > 0
          ">

          <thead>
            <tr>

              <th (click)="sort('code')">
                Company Code ↕
              </th>

              <th (click)="sort('name')">
                Company Name ↕
              </th>

              <th>
                Address
              </th>

              <th>
                Contact Information
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
              *ngFor="
                let company of pagedCompanies
              ">

              <td>
                {{ company.code }}
              </td>

              <td>
                {{ company.name }}
              </td>

              <td>
                {{ company.address || '-' }}
              </td>

              <td>
                {{ company.contact_information || '-' }}
              </td>

              <td>
                <span
                  class="status"
                  [class.active]="company.status"
                  [class.inactive]="!company.status">

                  {{
                    company.status
                      ? 'Active'
                      : 'Inactive'
                  }}

                </span>
              </td>

              <td class="actions">

                <button
                  type="button"
                  class="edit"
                  (click)="editCompany(company)">
                  Edit
                </button>

                <button
                  type="button"
                  class="delete"
                  (click)="deleteCompany(company)">
                  Delete
                </button>

              </td>

            </tr>

          </tbody>
        </table>

        <!-- EMPTY -->
        <div
          *ngIf="
            !loading &&
            filteredCompanies.length === 0
          "
          class="empty">

          No companies found.

        </div>

        <!-- PAGINATION -->
        <div
          *ngIf="filteredCompanies.length > 0"
          class="pagination">

          <button
            type="button"
            [disabled]="page === 1"
            (click)="previousPage()">
            Previous
          </button>

          <span>
            Page {{ page }} of {{ totalPages }}
          </span>

          <button
            type="button"
            [disabled]="page === totalPages"
            (click)="nextPage()">
            Next
          </button>

        </div>

      </div>

      <!-- ADD / EDIT MODAL -->
      <div
        class="overlay"
        *ngIf="showForm">

        <div class="modal">

          <!-- MODAL HEADER -->
          <div class="modal-header">

            <h2>
              {{
                editingId
                  ? 'Edit Company'
                  : 'Add Company'
              }}
            </h2>

            <button
              type="button"
              class="close"
              (click)="closeForm()">
              ×
            </button>

          </div>

          <!-- FORM -->
          <form
            #companyForm="ngForm"
            (ngSubmit)="saveCompany(companyForm)">

            <!-- COMPANY CODE -->
            <div class="field">

              <label>
                Company Code *
              </label>

              <input
                type="text"
                name="code"
                [(ngModel)]="form.code"
                required
                #code="ngModel"
                placeholder="Example: ABC001"
              />

              <small
                *ngIf="
                  code.invalid &&
                  code.touched
                "
                class="validation-error">

                Company Code is required.

              </small>

            </div>

            <!-- COMPANY NAME -->
            <div class="field">

              <label>
                Company Name *
              </label>

              <input
                type="text"
                name="name"
                [(ngModel)]="form.name"
                required
                #name="ngModel"
                placeholder="Example: ABC Technologies"
              />

              <small
                *ngIf="
                  name.invalid &&
                  name.touched
                "
                class="validation-error">

                Company Name is required.

              </small>

            </div>

            <!-- ADDRESS -->
            <div class="field">

              <label>
                Address
              </label>

              <textarea
                name="address"
                [(ngModel)]="form.address"
                placeholder="Company address">
              </textarea>

            </div>

            <!-- COUNTRY -->
            <div class="field">

              <label>
                Country Code *
              </label>

              <select
                name="countryCode"
                [(ngModel)]="countryCode"
                required>

                <option
                  *ngFor="let country of countries"
                  [value]="country.code">

                  {{ country.name }} ({{ country.code }})

                </option>

              </select>

            </div>

            <!-- PHONE -->
            <div class="field">

              <label>
                Contact Number *
              </label>

              <input
                type="tel"
                name="phoneNumber"
                [(ngModel)]="phoneNumber"
                required
                maxlength="10"
                minlength="10"
                pattern="[0-9]{10}"
                (input)="allowOnlyNumbers($event)"
                #phone="ngModel"
                placeholder="Enter 10 digit mobile number"
              />

              <small
                *ngIf="
                  phone.invalid &&
                  phone.touched
                "
                class="validation-error">

                <span *ngIf="phone.errors?.['required']">
                  Contact number is required.
                </span>

                <span
                  *ngIf="
                    phone.errors?.['pattern'] ||
                    phone.errors?.['minlength'] ||
                    phone.errors?.['maxlength']
                  ">
                  Enter exactly 10 digits.
                </span>

              </small>

              <small
                *ngIf="phoneNumber"
                class="phone-preview">

                Saved as:
                {{ countryCode }} {{ phoneNumber }}

              </small>

            </div>

            <!-- STATUS -->
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

            <!-- FORM ERROR -->
            <div
              *ngIf="formError"
              class="error-box">

              {{ formError }}

            </div>

            <!-- BUTTONS -->
            <div class="modal-actions">

              <button
                type="button"
                class="secondary"
                (click)="closeForm()">

                Cancel

              </button>

              <button
                type="submit"
                class="primary"
                [disabled]="companyForm.invalid">

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
      padding: 25px;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    h1 {
      margin: 0;
      font-size: 30px;
      color: #1f2937;
    }

    .muted {
      color: #6b7280;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow:
        0 2px 10px
        rgba(0, 0, 0, 0.08);
    }

    .search-row {
      margin-bottom: 20px;
    }

    .search-row input {
      width: 100%;
      max-width: 450px;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      box-sizing: border-box;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      background: #f9fafb;
      padding: 13px;
      border-bottom: 1px solid #e5e7eb;
      cursor: pointer;
      color: #374151;
    }

    td {
      padding: 13px;
      border-bottom: 1px solid #e5e7eb;
    }

    tr:hover {
      background: #f9fafb;
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

    .primary:hover {
      background: #1d4ed8;
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

    .error-box {
      background: #fee2e2;
      color: #991b1b;
      padding: 11px 13px;
      border-radius: 7px;
      margin-bottom: 15px;
    }

    .validation-error {
      display: block;
      color: #dc2626;
      margin-top: 5px;
      font-size: 13px;
    }

    .phone-preview {
      display: block;
      margin-top: 6px;
      color: #6b7280;
      font-size: 12px;
    }

    .empty {
      text-align: center;
      padding: 30px;
      color: #6b7280;
    }

    .loading {
      padding: 20px 0;
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 15px;
      margin-top: 20px;
    }

    .pagination button {
      background: #f3f4f6;
      color: #374151;
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      overflow-y: auto;
      padding: 20px;
    }

    .modal {
      background: white;
      width: min(600px, 95vw);
      max-height: 90vh;
      overflow-y: auto;
      padding: 25px;
      border-radius: 12px;
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
      color: #1f2937;
    }

    .close {
      background: transparent;
      font-size: 24px;
      padding: 3px 8px;
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

    .field input[type="text"],
    .field input[type="tel"],
    .field select,
    .field textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 14px;
      font-family: inherit;
    }

    .field textarea {
      min-height: 80px;
      resize: vertical;
    }

    .field select {
      background: white;
    }

    .field input:focus,
    .field select:focus,
    .field textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow:
        0 0 0 2px
        rgba(37, 99, 235, 0.15);
    }

    .checkbox label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox input {
      width: auto;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 25px;
    }

    @media (max-width: 800px) {

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

export class CompaniesComponent implements OnInit {

  api = inject(ApiService);

  companies: Company[] = [];
  filteredCompanies: Company[] = [];

  search = '';

  loading = false;
  error = '';
  formError = '';

  page = 1;
  pageSize = 5;

  sortField = '';
  sortDirection = 1;

  showForm = false;
  editingId: number | null = null;

  form: Company = {
    code: '',
    name: '',
    address: '',
    contact_information: '',
    status: true
  };

  countryCode = '+91';
  phoneNumber = '';

  /*
   * Country calling codes.
   * Country must be selected before saving.
   */
  countries: Country[] = [

    { name: 'Afghanistan', code: '+93' },
    { name: 'Albania', code: '+355' },
    { name: 'Algeria', code: '+213' },
    { name: 'Andorra', code: '+376' },
    { name: 'Angola', code: '+244' },
    { name: 'Argentina', code: '+54' },
    { name: 'Armenia', code: '+374' },
    { name: 'Australia', code: '+61' },
    { name: 'Austria', code: '+43' },
    { name: 'Azerbaijan', code: '+994' },

    { name: 'Bahamas', code: '+1-242' },
    { name: 'Bahrain', code: '+973' },
    { name: 'Bangladesh', code: '+880' },
    { name: 'Barbados', code: '+1-246' },
    { name: 'Belarus', code: '+375' },
    { name: 'Belgium', code: '+32' },
    { name: 'Belize', code: '+501' },
    { name: 'Benin', code: '+229' },
    { name: 'Bhutan', code: '+975' },
    { name: 'Bolivia', code: '+591' },
    { name: 'Bosnia and Herzegovina', code: '+387' },
    { name: 'Botswana', code: '+267' },
    { name: 'Brazil', code: '+55' },
    { name: 'Brunei', code: '+673' },
    { name: 'Bulgaria', code: '+359' },
    { name: 'Burkina Faso', code: '+226' },
    { name: 'Burundi', code: '+257' },

    { name: 'Cambodia', code: '+855' },
    { name: 'Cameroon', code: '+237' },
    { name: 'Canada', code: '+1' },
    { name: 'Cape Verde', code: '+238' },
    { name: 'Central African Republic', code: '+236' },
    { name: 'Chad', code: '+235' },
    { name: 'Chile', code: '+56' },
    { name: 'China', code: '+86' },
    { name: 'Colombia', code: '+57' },
    { name: 'Comoros', code: '+269' },
    { name: 'Costa Rica', code: '+506' },
    { name: 'Croatia', code: '+385' },
    { name: 'Cuba', code: '+53' },
    { name: 'Cyprus', code: '+357' },
    { name: 'Czech Republic', code: '+420' },

    { name: 'Denmark', code: '+45' },
    { name: 'Djibouti', code: '+253' },
    { name: 'Dominica', code: '+1-767' },
    { name: 'Dominican Republic', code: '+1-809' },

    { name: 'Ecuador', code: '+593' },
    { name: 'Egypt', code: '+20' },
    { name: 'El Salvador', code: '+503' },
    { name: 'Estonia', code: '+372' },
    { name: 'Eswatini', code: '+268' },
    { name: 'Ethiopia', code: '+251' },

    { name: 'Fiji', code: '+679' },
    { name: 'Finland', code: '+358' },
    { name: 'France', code: '+33' },

    { name: 'Gabon', code: '+241' },
    { name: 'Gambia', code: '+220' },
    { name: 'Georgia', code: '+995' },
    { name: 'Germany', code: '+49' },
    { name: 'Ghana', code: '+233' },
    { name: 'Greece', code: '+30' },
    { name: 'Grenada', code: '+1-473' },
    { name: 'Guatemala', code: '+502' },
    { name: 'Guinea', code: '+224' },
    { name: 'Guyana', code: '+592' },

    { name: 'Haiti', code: '+509' },
    { name: 'Honduras', code: '+504' },
    { name: 'Hungary', code: '+36' },

    { name: 'Iceland', code: '+354' },
    { name: 'India', code: '+91' },
    { name: 'Indonesia', code: '+62' },
    { name: 'Iran', code: '+98' },
    { name: 'Iraq', code: '+964' },
    { name: 'Ireland', code: '+353' },
    { name: 'Israel', code: '+972' },
    { name: 'Italy', code: '+39' },

    { name: 'Jamaica', code: '+1-876' },
    { name: 'Japan', code: '+81' },
    { name: 'Jordan', code: '+962' },

    { name: 'Kazakhstan', code: '+7' },
    { name: 'Kenya', code: '+254' },
    { name: 'Kiribati', code: '+686' },
    { name: 'Kuwait', code: '+965' },
    { name: 'Kyrgyzstan', code: '+996' },

    { name: 'Laos', code: '+856' },
    { name: 'Latvia', code: '+371' },
    { name: 'Lebanon', code: '+961' },
    { name: 'Lesotho', code: '+266' },
    { name: 'Liberia', code: '+231' },
    { name: 'Libya', code: '+218' },
    { name: 'Liechtenstein', code: '+423' },
    { name: 'Lithuania', code: '+370' },
    { name: 'Luxembourg', code: '+352' },

    { name: 'Madagascar', code: '+261' },
    { name: 'Malawi', code: '+265' },
    { name: 'Malaysia', code: '+60' },
    { name: 'Maldives', code: '+960' },
    { name: 'Mali', code: '+223' },
    { name: 'Malta', code: '+356' },
    { name: 'Marshall Islands', code: '+692' },
    { name: 'Mauritania', code: '+222' },
    { name: 'Mauritius', code: '+230' },
    { name: 'Mexico', code: '+52' },
    { name: 'Micronesia', code: '+691' },
    { name: 'Moldova', code: '+373' },
    { name: 'Monaco', code: '+377' },
    { name: 'Mongolia', code: '+976' },
    { name: 'Montenegro', code: '+382' },
    { name: 'Morocco', code: '+212' },
    { name: 'Mozambique', code: '+258' },
    { name: 'Myanmar', code: '+95' },

    { name: 'Namibia', code: '+264' },
    { name: 'Nauru', code: '+674' },
    { name: 'Nepal', code: '+977' },
    { name: 'Netherlands', code: '+31' },
    { name: 'New Zealand', code: '+64' },
    { name: 'Nicaragua', code: '+505' },
    { name: 'Niger', code: '+227' },
    { name: 'Nigeria', code: '+234' },
    { name: 'North Korea', code: '+850' },
    { name: 'North Macedonia', code: '+389' },
    { name: 'Norway', code: '+47' },

    { name: 'Oman', code: '+968' },

    { name: 'Pakistan', code: '+92' },
    { name: 'Palau', code: '+680' },
    { name: 'Palestine', code: '+970' },
    { name: 'Panama', code: '+507' },
    { name: 'Papua New Guinea', code: '+675' },
    { name: 'Paraguay', code: '+595' },
    { name: 'Peru', code: '+51' },
    { name: 'Philippines', code: '+63' },
    { name: 'Poland', code: '+48' },
    { name: 'Portugal', code: '+351' },

    { name: 'Qatar', code: '+974' },

    { name: 'Romania', code: '+40' },
    { name: 'Russia', code: '+7' },
    { name: 'Rwanda', code: '+250' },

    { name: 'Saint Kitts and Nevis', code: '+1-869' },
    { name: 'Saint Lucia', code: '+1-758' },
    { name: 'Saint Vincent and the Grenadines', code: '+1-784' },
    { name: 'Samoa', code: '+685' },
    { name: 'San Marino', code: '+378' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'Senegal', code: '+221' },
    { name: 'Serbia', code: '+381' },
    { name: 'Seychelles', code: '+248' },
    { name: 'Sierra Leone', code: '+232' },
    { name: 'Singapore', code: '+65' },
    { name: 'Slovakia', code: '+421' },
    { name: 'Slovenia', code: '+386' },
    { name: 'Solomon Islands', code: '+677' },
    { name: 'Somalia', code: '+252' },
    { name: 'South Africa', code: '+27' },
    { name: 'South Korea', code: '+82' },
    { name: 'South Sudan', code: '+211' },
    { name: 'Spain', code: '+34' },
    { name: 'Sri Lanka', code: '+94' },
    { name: 'Sudan', code: '+249' },
    { name: 'Suriname', code: '+597' },
    { name: 'Sweden', code: '+46' },
    { name: 'Switzerland', code: '+41' },
    { name: 'Syria', code: '+963' },

    { name: 'Taiwan', code: '+886' },
    { name: 'Tajikistan', code: '+992' },
    { name: 'Tanzania', code: '+255' },
    { name: 'Thailand', code: '+66' },
    { name: 'Timor-Leste', code: '+670' },
    { name: 'Togo', code: '+228' },
    { name: 'Tonga', code: '+676' },
    { name: 'Trinidad and Tobago', code: '+1-868' },
    { name: 'Tunisia', code: '+216' },
    { name: 'Turkey', code: '+90' },
    { name: 'Turkmenistan', code: '+993' },
    { name: 'Tuvalu', code: '+688' },

    { name: 'Uganda', code: '+256' },
    { name: 'Ukraine', code: '+380' },
    { name: 'United Arab Emirates', code: '+971' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'United States', code: '+1' },
    { name: 'Uruguay', code: '+598' },
    { name: 'Uzbekistan', code: '+998' },

    { name: 'Vanuatu', code: '+678' },
    { name: 'Vatican City', code: '+39' },
    { name: 'Venezuela', code: '+58' },
    { name: 'Vietnam', code: '+84' },

    { name: 'Yemen', code: '+967' },

    { name: 'Zambia', code: '+260' },
    { name: 'Zimbabwe', code: '+263' }

  ];

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {

    this.loading = true;
    this.error = '';

    this.api
      .get<any>('/companies/')
      .subscribe({

        next: (response) => {

          this.companies =
            response.results ?? response;

          this.filteredCompanies =
            [...this.companies];

          this.loading = false;

          this.applySearch();
        },

        error: (err) => {

          console.error(
            'Unable to load companies:',
            err
          );

          this.loading = false;

          this.error =
            'Unable to load companies.';
        }

      });

  }

  applySearch(): void {

    const value =
      this.search
        .toLowerCase()
        .trim();

    this.filteredCompanies =
      this.companies.filter(company =>

        company.code
          ?.toLowerCase()
          .includes(value)

        ||

        company.name
          ?.toLowerCase()
          .includes(value)

        ||

        company.contact_information
          ?.toLowerCase()
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

    this.filteredCompanies.sort(
      (a: any, b: any) => {

        const valueA =
          String(
            a[field] ?? ''
          ).toLowerCase();

        const valueB =
          String(
            b[field] ?? ''
          ).toLowerCase();

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
        this.filteredCompanies.length /
        this.pageSize
      )
    );

  }

  get pagedCompanies(): Company[] {

    const start =
      (this.page - 1) *
      this.pageSize;

    return this.filteredCompanies.slice(
      start,
      start + this.pageSize
    );

  }

  previousPage(): void {

    if (this.page > 1) {
      this.page--;
    }

  }

  nextPage(): void {

    if (this.page < this.totalPages) {
      this.page++;
    }

  }

  openForm(): void {

    this.editingId = null;

    this.form = {
      code: '',
      name: '',
      address: '',
      contact_information: '',
      status: true
    };

    this.countryCode = '+91';
    this.phoneNumber = '';

    this.formError = '';
    this.error = '';

    this.showForm = true;
  }

  editCompany(company: Company): void {

    this.editingId =
      company.id ?? null;

    this.form = {
      id: company.id,
      code: company.code,
      name: company.name,
      address: company.address || '',
      contact_information:
        company.contact_information || '',
      status: company.status
    };

    /*
     * Convert stored:
     * +91 9876543210
     *
     * back into:
     * countryCode = +91
     * phoneNumber = 9876543210
     */
    const stored =
      (company.contact_information || '').trim();

    const match =
      stored.match(
        /^(\+\d+(?:-\d+)?)\s+(\d{10})$/
      );

    if (match) {

      this.countryCode = match[1];
      this.phoneNumber = match[2];

    } else {

      this.countryCode = '+91';
      this.phoneNumber =
        stored.replace(/\D/g, '').slice(-10);

    }

    this.formError = '';
    this.error = '';

    this.showForm = true;
  }

  closeForm(): void {

    this.showForm = false;
    this.formError = '';

  }

  allowOnlyNumbers(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const value =
      input.value
        .replace(/[^0-9]/g, '')
        .slice(0, 10);

    this.phoneNumber = value;
    input.value = value;
  }

  saveCompany(companyForm: any): void {

    this.formError = '';
    this.error = '';

    if (companyForm.invalid) {

      companyForm.control.markAllAsTouched();

      return;
    }

    const code =
      String(
        this.form.code ?? ''
      ).trim();

    const name =
      String(
        this.form.name ?? ''
      ).trim();

    const address =
      String(
        this.form.address ?? ''
      ).trim();

    const phone =
      String(
        this.phoneNumber ?? ''
      ).trim();

    /*
     * REQUIRED VALIDATION
     */
    if (!code) {

      this.formError =
        'Company code is required.';

      return;
    }

    if (!name) {

      this.formError =
        'Company name is required.';

      return;
    }

    /*
     * COUNTRY CODE VALIDATION
     */
    if (!this.countryCode) {

      this.formError =
        'Country code is required.';

      return;
    }

    /*
     * EXACTLY 10 DIGITS
     */
    if (!/^\d{10}$/.test(phone)) {

      this.formError =
        'Contact number must contain exactly 10 digits.';

      return;
    }

    /*
     * DUPLICATE COMPANY CODE
     */
    const duplicateCode =
      this.companies.some(
        company =>

          company.code
            ?.trim()
            .toLowerCase()
          ===
          code.toLowerCase()

          &&

          company.id !==
          this.editingId
      );

    if (duplicateCode) {

      this.formError =
        `Company code "${code}" already exists.`;

      return;
    }

    /*
     * DUPLICATE COMPANY NAME
     */
    const duplicateName =
      this.companies.some(
        company =>

          company.name
            ?.trim()
            .toLowerCase()
          ===
          name.toLowerCase()

          &&

          company.id !==
          this.editingId
      );

    if (duplicateName) {

      this.formError =
        `Company name "${name}" already exists.`;

      return;
    }

    /*
     * COMPLETE CONTACT NUMBER
     *
     * Example:
     * +91 9876543210
     */
    const contactInformation =
      `${this.countryCode} ${phone}`;

    const data = {

      code: code,

      name: name,

      address: address,

      contact_information:
        contactInformation,

      status:
        this.form.status

    };

    /*
     * UPDATE
     */
    if (this.editingId !== null) {

      this.api
        .put(
          '/companies/' +
          this.editingId +
          '/',
          data
        )
        .subscribe({

          next: () => {

            this.closeForm();

            this.loadCompanies();

          },

          error: (err) => {

            console.error(
              'Company update error:',
              err
            );

            this.showBackendError(err);

          }

        });

      return;
    }

    /*
     * CREATE
     */
    this.api
      .post(
        '/companies/',
        data
      )
      .subscribe({

        next: () => {

          this.closeForm();

          this.loadCompanies();

        },

        error: (err) => {

          console.error(
            'Company creation error:',
            err
          );

          this.showBackendError(err);

        }

      });

  }

  private showBackendError(err: any): void {

    if (err.error?.code) {

      const message =
        Array.isArray(err.error.code)
          ? err.error.code[0]
          : err.error.code;

      this.formError =
        message;

      return;
    }

    if (err.error?.name) {

      const message =
        Array.isArray(err.error.name)
          ? err.error.name[0]
          : err.error.name;

      this.formError =
        message;

      return;
    }

    if (err.error?.contact_information) {

      const message =
        Array.isArray(
          err.error.contact_information
        )
          ? err.error.contact_information[0]
          : err.error.contact_information;

      this.formError =
        message;

      return;
    }

    if (err.error?.detail) {

      this.formError =
        err.error.detail;

      return;
    }

    this.formError =
      this.editingId !== null
        ? 'Unable to update company. Please try again.'
        : 'Unable to create company. Please try again.';
  }

  deleteCompany(company: Company): void {

    const confirmed =
      confirm(
        `Are you sure you want to delete "${company.name}"?`
      );

    if (!confirmed) {
      return;
    }

    if (!company.id) {
      return;
    }

    this.api
      .delete(
        '/companies/' +
        company.id +
        '/'
      )
      .subscribe({

        next: () => {

          this.loadCompanies();

        },

        error: (err) => {

          console.error(
            'Unable to delete company:',
            err
          );

          this.error =
            'Unable to delete company.';

        }

      });

  }

}