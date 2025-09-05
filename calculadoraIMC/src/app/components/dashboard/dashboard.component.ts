import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav mode="side" opened class="sidenav">
          <div class="sidenav-header">
            <h2>SmithStrong</h2>
            <p>Panel de Control</p>
          </div>
          
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard/calculator" routerLinkActive="active">
              <mat-icon matListItemIcon>calculate</mat-icon>
              <span matListItemTitle>Calculadora IMC</span>
            </a>
            
            <a mat-list-item routerLink="/dashboard/history" routerLinkActive="active">
              <mat-icon matListItemIcon>history</mat-icon>
              <span matListItemTitle>Historial</span>
            </a>
            
            <a mat-list-item routerLink="/dashboard/recommendations" routerLinkActive="active">
              <mat-icon matListItemIcon>fitness_center</mat-icon>
              <span matListItemTitle>Recomendaciones</span>
            </a>
            
            <a mat-list-item routerLink="/dashboard/profile" routerLinkActive="active">
              <mat-icon matListItemIcon>person</mat-icon>
              <span matListItemTitle>Perfil</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="main-content">
          <!-- Top Toolbar -->
          <mat-toolbar color="primary" class="top-toolbar">
            <span class="toolbar-spacer"></span>
            
            <div class="user-menu">
              <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
                <mat-icon>account_circle</mat-icon>
                <span *ngIf="currentUser">{{currentUser.person?.name}}</span>
                <mat-icon>arrow_drop_down</mat-icon>
              </button>
              
              <mat-menu #userMenu="matMenu">
                <button mat-menu-item routerLink="/dashboard/profile">
                  <mat-icon>person</mat-icon>
                  <span>Perfil</span>
                </button>
                <button mat-menu-item (click)="logout()">
                  <mat-icon>exit_to_app</mat-icon>
                  <span>Cerrar Sesión</span>
                </button>
              </mat-menu>
            </div>
          </mat-toolbar>

          <!-- Dashboard Content -->
          <div class="dashboard-content">
            <router-outlet></router-outlet>
            
            <!-- Default Content when no route is active -->
            <div *ngIf="showWelcome" class="welcome-content">
              <div class="welcome-header">
                <h1>¡Bienvenido a SmithStrong!</h1>
                <p *ngIf="currentUser">Hola {{currentUser.person?.name}}, gestiona tu IMC y mantente en forma</p>
              </div>

              <div class="dashboard-cards">
                <mat-card class="dashboard-card" (click)="navigateTo('/dashboard/calculator')">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>calculate</mat-icon>
                    <mat-card-title>Calculadora IMC</mat-card-title>
                    <mat-card-subtitle>Calcula tu índice de masa corporal</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>Ingresa tu peso y altura para calcular tu IMC actual y ver tu progreso.</p>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-raised-button color="primary">Calcular IMC</button>
                  </mat-card-actions>
                </mat-card>

                <mat-card class="dashboard-card" (click)="navigateTo('/dashboard/history')">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>history</mat-icon>
                    <mat-card-title>Historial</mat-card-title>
                    <mat-card-subtitle>Revisa tu progreso</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>Consulta tu historial de IMC y observa tu evolución a lo largo del tiempo.</p>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-raised-button color="accent">Ver Historial</button>
                  </mat-card-actions>
                </mat-card>

                <mat-card class="dashboard-card" (click)="navigateTo('/dashboard/recommendations')">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>fitness_center</mat-icon>
                    <mat-card-title>Recomendaciones</mat-card-title>
                    <mat-card-subtitle>Rutinas y dietas personalizadas</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>Obtén rutinas de ejercicio y planes de alimentación basados en tu perfil.</p>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-raised-button color="warn">Ver Recomendaciones</button>
                  </mat-card-actions>
                </mat-card>

                <mat-card class="dashboard-card" (click)="navigateTo('/dashboard/profile')">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>person</mat-icon>
                    <mat-card-title>Perfil</mat-card-title>
                    <mat-card-subtitle>Gestiona tu información personal</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>Actualiza tus datos personales y configuración de la cuenta.</p>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-raised-button>Editar Perfil</button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      overflow: hidden;
    }

    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 280px;
      background: #f5f5f5;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-header {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .sidenav-header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .sidenav-header p {
      margin: 5px 0 0 0;
      opacity: 0.8;
    }

    .main-content {
      height: 100%;
      overflow-y: auto;
    }

    .top-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dashboard-content {
      padding: 20px;
      min-height: calc(100vh - 64px);
    }

    .welcome-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .welcome-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 10px;
    }

    .welcome-header p {
      font-size: 1.2rem;
      color: #666;
    }

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 40px;
    }

    .dashboard-card {
      cursor: pointer;
      transition: all 0.3s ease;
      height: 200px;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .dashboard-card mat-card-header {
      margin-bottom: 15px;
    }

    .dashboard-card mat-icon[mat-card-avatar] {
      font-size: 32px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #667eea;
      color: white;
    }

    .active {
      background-color: rgba(102, 126, 234, 0.1) !important;
      color: #667eea !important;
    }

    .active mat-icon {
      color: #667eea !important;
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
      }
      
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  showWelcome = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Verificar si hay una ruta activa
    this.router.events.subscribe(() => {
      this.showWelcome = this.router.url === '/dashboard' || this.router.url === '/dashboard/';
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
