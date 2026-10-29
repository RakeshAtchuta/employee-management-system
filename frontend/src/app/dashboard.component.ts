import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { ApiService } from './api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  template: `
    <div class="app-layout">

      <!-- =========================
           SIDEBAR
           ========================= -->
      <aside class="sidebar">

        <!-- BRAND -->
        <div class="brand">

          <div class="brand-icon">
            EM
          </div>

          <div>
            <div class="brand-title">
              Employee
            </div>

            <div class="brand-subtitle">
              Management
            </div>
          </div>

        </div>


        <!-- MAIN MENU -->
        <div class="menu-title">
          MAIN MENU
        </div>


        <nav class="menu">

          <!-- DASHBOARD -->
          <a
            routerLink="/dashboard"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="menu-item"
          >
            <span class="icon">⌂</span>
            <span>Dashboard</span>
          </a>


          <!-- EMPLOYEES -->
          <a
            routerLink="/employees"
            routerLinkActive="active"
            class="menu-item"
          >
            <span class="icon">👥</span>
            <span>Employees</span>
          </a>


          <!-- DEPARTMENTS -->
          <a
            routerLink="/departments"
            routerLinkActive="active"
            class="menu-item"
          >
            <span class="icon">▦</span>
            <span>Departments</span>
          </a>


          <!-- COMPANIES -->
          <a
            routerLink="/companies"
            routerLinkActive="active"
            class="menu-item"
          >
            <span class="icon">▣</span>
            <span>Companies</span>
          </a>

        </nav>


        <!-- =========================
             MASTER DATA
             ========================= -->
        <div class="menu-title master-title">
          MASTER DATA
        </div>


        <nav class="menu">

          <!-- EMPLOYEE TYPES -->
          <a
            routerLink="/employee-types"
            routerLinkActive="active"
            class="menu-item"
          >
            <span class="icon">◈</span>
            <span>Employee Types</span>
          </a>


          <!-- DESIGNATIONS -->
          <a
            routerLink="/designations"
            routerLinkActive="active"
            class="menu-item"
          >
            <span class="icon">◆</span>
            <span>Designations</span>
          </a>


          <!-- LOCATIONS -->
          <a
            routerLink="/locations"
            routerLinkActive="active"
            class="menu-item"
          >
            <span class="icon">⌖</span>
            <span>Locations</span>
          </a>

        </nav>


        <!-- SIDEBAR BOTTOM -->
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


      <!-- =========================
           MAIN CONTENT
           ========================= -->
      <main class="main-content">


        <!-- TOP BAR -->
        <header class="topbar">

          <div>
            <h2>
              Dashboard
            </h2>

            <p>
              Employee workforce overview
            </p>
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


        <!-- =========================
             DASHBOARD CONTENT
             ========================= -->
        <section class="content">


          <!-- LOADING -->
          <div
            *ngIf="loading"
            class="loading"
          >
            Loading dashboard...
          </div>


          <!-- ERROR -->
          <div
            *ngIf="error"
            class="error-box"
          >
            {{ error }}
          </div>


          <!-- =========================
               SUMMARY CARDS
               ========================= -->
          <div
            *ngIf="!loading"
            class="stats-grid"
          >


            <!-- TOTAL EMPLOYEES -->
            <div class="stat-card">

              <div class="stat-icon blue">
                👥
              </div>

              <div class="stat-content">

                <span>
                  Total Employees
                </span>

                <strong>
                  {{ dashboard.total_employees }}
                </strong>

              </div>

            </div>


            <!-- MALE -->
            <div class="stat-card">

              <div class="stat-icon green">
                ♂
              </div>

              <div class="stat-content">

                <span>
                  Male Employees
                </span>

                <strong>
                  {{ dashboard.male_employees }}
                </strong>

              </div>

            </div>


            <!-- FEMALE -->
            <div class="stat-card">

              <div class="stat-icon pink">
                ♀
              </div>

              <div class="stat-content">

                <span>
                  Female Employees
                </span>

                <strong>
                  {{ dashboard.female_employees }}
                </strong>

              </div>

            </div>


            <!-- PERMANENT -->
            <div class="stat-card">

              <div class="stat-icon purple">
                ✓
              </div>

              <div class="stat-content">

                <span>
                  Permanent
                </span>

                <strong>
                  {{ dashboard.permanent_employees }}
                </strong>

              </div>

            </div>


            <!-- TEMPORARY -->
            <div class="stat-card">

              <div class="stat-icon orange">
                ◷
              </div>

              <div class="stat-content">

                <span>
                  Temporary
                </span>

                <strong>
                  {{ dashboard.temporary_employees }}
                </strong>

              </div>

            </div>


            <!-- DEPARTMENTS -->
            <div class="stat-card">

              <div class="stat-icon teal">
                ▦
              </div>

              <div class="stat-content">

                <span>
                  Departments
                </span>

                <strong>
                  {{ dashboard.total_departments }}
                </strong>

              </div>

            </div>


            <!-- COMPANIES -->
            <div class="stat-card">

              <div class="stat-icon indigo">
                ▣
              </div>

              <div class="stat-content">

                <span>
                  Companies
                </span>

                <strong>
                  {{ dashboard.total_companies }}
                </strong>

              </div>

            </div>

          </div>


          <!-- =========================
               QUICK ACTIONS
               ========================= -->
          <div class="section-title">
            Quick Actions
          </div>


          <div class="quick-grid">


            <!-- EMPLOYEES -->
            <a
              routerLink="/employees"
              class="quick-card"
            >

              <div class="quick-icon">
                👥
              </div>

              <div>

                <strong>
                  Employee Management
                </strong>

                <span>
                  Add, edit, view and manage employees
                </span>

              </div>

            </a>


            <!-- DEPARTMENTS -->
            <a
              routerLink="/departments"
              class="quick-card"
            >

              <div class="quick-icon">
                ▦
              </div>

              <div>

                <strong>
                  Department Management
                </strong>

                <span>
                  Manage company departments
                </span>

              </div>

            </a>


            <!-- COMPANIES -->
            <a
              routerLink="/companies"
              class="quick-card"
            >

              <div class="quick-icon">
                ▣
              </div>

              <div>

                <strong>
                  Company Management
                </strong>

                <span>
                  Manage company information
                </span>

              </div>

            </a>


            <!-- EMPLOYEE TYPES -->
            <a
              routerLink="/employee-types"
              class="quick-card"
            >

              <div class="quick-icon">
                ◈
              </div>

              <div>

                <strong>
                  Employee Types
                </strong>

                <span>
                  Manage permanent and temporary employee types
                </span>

              </div>

            </a>


            <!-- DESIGNATIONS -->
            <a
              routerLink="/designations"
              class="quick-card"
            >

              <div class="quick-icon">
                ◆
              </div>

              <div>

                <strong>
                  Designations
                </strong>

                <span>
                  Manage employee designations
                </span>

              </div>

            </a>


            <!-- LOCATIONS -->
            <a
              routerLink="/locations"
              class="quick-card"
            >

              <div class="quick-icon">
                ⌖
              </div>

              <div>

                <strong>
                  Locations
                </strong>

                <span>
                  Manage employee work locations
                </span>

              </div>

            </a>

          </div>

        </section>

      </main>

    </div>
  `,


  styles: [`

    /* =========================
       GLOBAL
       ========================= */

    * {
      box-sizing: border-box;
    }


    .app-layout {
      min-height: 100vh;
      display: flex;
      background: #f5f7fb;
      color: #1f2937;
    }


    /* =========================
       SIDEBAR
       ========================= */

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
      font-size: 14px;
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


    .master-title {
      margin-top: 10px;
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
      transition: 0.2s;
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
      font-size: 17px;
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


    /* =========================
       MAIN
       ========================= */

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
      margin-top: 2px;
    }


    .content {
      padding: 30px;
    }


    /* =========================
       STAT CARDS
       ========================= */

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
    }


    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }


    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 21px;
      flex-shrink: 0;
    }


    .blue {
      background: #dbeafe;
      color: #2563eb;
    }


    .green {
      background: #dcfce7;
      color: #16a34a;
    }


    .pink {
      background: #fce7f3;
      color: #db2777;
    }


    .purple {
      background: #ede9fe;
      color: #7c3aed;
    }


    .orange {
      background: #ffedd5;
      color: #ea580c;
    }


    .teal {
      background: #ccfbf1;
      color: #0f766e;
    }


    .indigo {
      background: #e0e7ff;
      color: #4f46e5;
    }


    .stat-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }


    .stat-content span {
      color: #6b7280;
      font-size: 13px;
    }


    .stat-content strong {
      font-size: 27px;
      margin-top: 5px;
      color: #111827;
    }


    /* =========================
       QUICK ACTIONS
       ========================= */

    .section-title {
      margin: 32px 0 15px;
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }


    .quick-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }


    .quick-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      color: #111827;
      transition: 0.2s;
    }


    .quick-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      border-color: #bfdbfe;
    }


    .quick-icon {
      width: 44px;
      height: 44px;
      border-radius: 9px;
      background: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 18px;
    }


    .quick-card strong {
      display: block;
      font-size: 14px;
    }


    .quick-card span {
      display: block;
      margin-top: 5px;
      color: #6b7280;
      font-size: 12px;
      line-height: 1.4;
    }


    /* =========================
       STATES
       ========================= */

    .loading {
      background: white;
      padding: 20px;
      border-radius: 10px;
      color: #6b7280;
    }


    .error-box {
      background: #fee2e2;
      color: #991b1b;
      padding: 12px 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 1100px) {

      .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }


      .quick-grid {
        grid-template-columns: 1fr;
      }

    }


    @media (max-width: 700px) {

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


      .menu {
        padding: 0 8px;
      }


      .menu-item {
        justify-content: center;
        padding: 0;
      }


      .logout-button {
        justify-content: center;
        padding: 0;
      }


      .topbar {
        padding: 0 15px;
      }


      .content {
        padding: 15px;
      }


      .stats-grid {
        grid-template-columns: 1fr;
      }

    }

  `]
})


export class DashboardComponent implements OnInit {

  api = inject(ApiService);

  router = inject(Router);


  loading = false;

  error = '';


  dashboard = {

    total_employees: 0,

    male_employees: 0,

    female_employees: 0,

    permanent_employees: 0,

    temporary_employees: 0,

    total_departments: 0,

    total_companies: 0

  };


  ngOnInit(): void {

    this.loadDashboard();

  }


  loadDashboard(): void {

    this.loading = true;

    this.error = '';


    this.api
      .get<any>('/dashboard/')
      .subscribe({

        next: (response) => {

          this.dashboard = {

            total_employees:
              response.total_employees ?? 0,

            male_employees:
              response.male_employees ?? 0,

            female_employees:
              response.female_employees ?? 0,

            permanent_employees:
              response.permanent_employees ?? 0,

            temporary_employees:
              response.temporary_employees ?? 0,

            total_departments:
              response.total_departments ?? 0,

            total_companies:
              response.total_companies ?? 0

          };


          this.loading = false;

        },


        error: (err) => {

          console.error(
            'Dashboard loading error:',
            err
          );


          this.loading = false;

          this.error =
            'Unable to load dashboard data.';

        }

      });

  }


  logout(): void {

    localStorage.removeItem('access');

    localStorage.removeItem('refresh');

    this.router.navigate(['/login']);

  }

}