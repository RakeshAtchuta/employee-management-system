import {Component,inject} from '@angular/core';import {RouterLink,RouterOutlet} from '@angular/router';import {Router} from '@angular/router';
@Component({standalone:true,imports:[RouterLink,RouterOutlet],template:`
<div class="shell"><aside class="side"><h2>EMS</h2><p>Employee Management</p>
<a routerLink="/dashboard">Dashboard</a><a routerLink="/employees">Employees</a><a routerLink="/departments">Departments</a><a routerLink="/companies">Companies</a>
<a routerLink="/master-data">Master Data</a></aside><main class="main"><header class="top"><b>Enterprise Admin</b><button (click)="logout()">Logout</button></header><router-outlet/></main></div>`})
export class ShellComponent{router=inject(Router);logout(){localStorage.clear();this.router.navigate(['/login'])}}