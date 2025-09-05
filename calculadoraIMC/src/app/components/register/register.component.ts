import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { RecommendationService } from '../../services/recommendation.service';
import { RegisterRequest } from '../../models/auth.model';
import { Disability } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <div class="brand-container">
            <h1 class="brand-title">SmithStrong</h1>
            <p class="brand-subtitle">Crear Nueva Cuenta</p>
          </div>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Datos de Cuenta -->
            <div class="section-title">Datos de la Cuenta</div>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Ingrese un email válido
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
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Datos Personales -->
            <div class="section-title">Datos Personales</div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="name" required>
                <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="lastname" required>
                <mat-error *ngIf="registerForm.get('lastname')?.hasError('required')">
                  El apellido es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Edad</mat-label>
                <input matInput type="number" formControlName="age" required min="13" max="120">
                <mat-error *ngIf="registerForm.get('age')?.hasError('required')">
                  La edad es requerida
                </mat-error>
                <mat-error *ngIf="registerForm.get('age')?.hasError('min')">
                  Edad mínima: 13 años
                </mat-error>
                <mat-error *ngIf="registerForm.get('age')?.hasError('max')">
                  Edad máxima: 120 años
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Género</mat-label>
                <mat-select formControlName="gender" required>
                  <mat-option value="M">Masculino</mat-option>
                  <mat-option value="F">Femenino</mat-option>
                </mat-select>
                <mat-error *ngIf="registerForm.get('gender')?.hasError('required')">
                  El género es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Discapacidad (Opcional)</mat-label>
              <mat-select formControlName="idDisability">
                <mat-option [value]="null">Ninguna</mat-option>
                <mat-option *ngFor="let disability of disabilities" [value]="disability.id">
                  {{disability.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button 
                    color="primary" 
                    type="submit" 
                    class="full-width submit-btn"
                    [disabled]="registerForm.invalid || isLoading">
              {{isLoading ? 'Registrando...' : 'Registrarse'}}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions class="card-actions">
          <p>¿Ya tienes cuenta? 
            <a routerLink="/login" class="login-link">Inicia sesión aquí</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 600px;
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

    .section-title {
      font-size: 1.2rem;
      font-weight: 500;
      color: #333;
      margin: 20px 0 15px 0;
      border-bottom: 2px solid #667eea;
      padding-bottom: 5px;
    }

    .form-row {
      display: flex;
      gap: 15px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .half-width {
      flex: 1;
      margin-bottom: 15px;
    }

    .submit-btn {
      height: 45px;
      font-size: 16px;
      margin-top: 20px;
    }

    .card-actions {
      justify-content: center;
      padding-top: 20px;
    }

    .login-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  disabilities: Disability[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private recommendationService: RecommendationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(13), Validators.max(120)]],
      gender: ['', [Validators.required]],
      idDisability: [null]
    });
  }

  ngOnInit(): void {
    this.loadDisabilities();
    
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  loadDisabilities(): void {
    this.recommendationService.getDisabilities().subscribe({
      next: (disabilities) => {
        this.disabilities = disabilities;
      },
      error: (error) => {
        console.error('Error al cargar discapacidades:', error);
        // Datos mock para testing
        this.disabilities = [
          { id: 1, name: 'Ceguera' },
          { id: 2, name: 'Movilidad reducida' },
          { id: 3, name: 'Discapacidad auditiva' },
          { id: 4, name: 'Discapacidad cognitiva' }
        ];
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.value;
      
      const registerData: RegisterRequest = {
        email: formData.email,
        password: formData.password,
        person: {
          name: formData.name,
          lastname: formData.lastname,
          age: formData.age,
          gender: formData.gender,
          idDisability: formData.idDisability
        }
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('¡Cuenta creada exitosamente!', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Error al crear la cuenta. Intenta nuevamente.', 'Cerrar', {
            duration: 5000
          });
          console.error('Error de registro:', error);
        }
      });
    }
  }
}
