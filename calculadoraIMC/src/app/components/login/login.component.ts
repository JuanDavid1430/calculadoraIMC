import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="brand-container">
            <h1 class="brand-title">SmithStrong</h1>
            <p class="brand-subtitle">Sistema de Gestión de IMC</p>
          </div>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input matInput type="text" formControlName="email" required>
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                El usuario es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput 
                     [type]="hidePassword ? 'password' : 'text'" 
                     formControlName="password" 
                     required>
              <button mat-icon-button matSuffix 
                      (click)="hidePassword = !hidePassword" 
                      type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
            </mat-form-field>

            <button mat-raised-button 
                    color="primary" 
                    type="submit" 
                    class="full-width submit-btn"
                    [disabled]="loginForm.invalid || isLoading">
              {{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions class="card-actions">
          <p>¿No tienes cuenta? 
            <a routerLink="/register" class="register-link">Regístrate aquí</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .brand-container {
      text-align: center;
      margin-bottom: 20px;
    }

    .brand-title {
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
      margin: 0;
    }

    .brand-subtitle {
      color: #666;
      margin: 5px 0 0 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .submit-btn {
      height: 45px;
      font-size: 16px;
      margin-top: 10px;
    }

    .card-actions {
      justify-content: center;
      padding-top: 20px;
    }

    .register-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData: LoginRequest = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('¡Bienvenido a SmithStrong!', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Error al iniciar sesión. Verifica tus credenciales.', 'Cerrar', {
            duration: 5000
          });
          console.error('Error de login:', error);
        }
      });
    }
  }
}
