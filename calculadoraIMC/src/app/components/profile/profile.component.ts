import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { RecommendationService } from '../../services/recommendation.service';
import { User, Disability } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y configuración de la cuenta</p>
      </div>

      <div class="profile-content" *ngIf="currentUser">
        <mat-tab-group>
          <!-- Pestaña de Información Personal -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>person</mat-icon>
              Información Personal
            </ng-template>
            
            <div class="tab-content">
              <!-- Avatar Section -->
              <mat-card class="avatar-card">
                <mat-card-content>
                  <div class="avatar-section">
                    <div class="avatar-container">
                      <div class="avatar-circle" [style.background-image]="getAvatarImage()">
                        <mat-icon *ngIf="!currentUser.image">person</mat-icon>
                      </div>
                      <button mat-fab color="primary" class="avatar-edit-btn">
                        <mat-icon>camera_alt</mat-icon>
                      </button>
                    </div>
                    <div class="avatar-info">
                      <h2>{{currentUser.person?.name}} {{currentUser.person?.lastname}}</h2>
                      <p class="user-email">{{currentUser.email}}</p>
                      <p class="user-details">
                        {{currentUser.person?.age}} años • 
                        {{currentUser.person?.gender === 'M' ? 'Masculino' : 'Femenino'}}
                        <span *ngIf="currentUser.person?.disability"> • {{currentUser.person?.disability?.name}}</span>
                      </p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Formulario de Datos Personales -->
              <mat-card class="form-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>edit</mat-icon>
                    Editar Información Personal
                  </mat-card-title>
                </mat-card-header>
                
                <mat-card-content>
                  <form [formGroup]="personalForm" (ngSubmit)="onUpdatePersonal()">
                    <div class="form-row">
                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Nombre</mat-label>
                        <input matInput formControlName="name" required>
                        <mat-icon matSuffix>person</mat-icon>
                        <mat-error *ngIf="personalForm.get('name')?.hasError('required')">
                          El nombre es requerido
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Apellido</mat-label>
                        <input matInput formControlName="lastname" required>
                        <mat-icon matSuffix>person</mat-icon>
                        <mat-error *ngIf="personalForm.get('lastname')?.hasError('required')">
                          El apellido es requerido
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Edad</mat-label>
                        <input matInput type="number" formControlName="age" required min="13" max="120">
                        <mat-icon matSuffix>cake</mat-icon>
                        <mat-error *ngIf="personalForm.get('age')?.hasError('required')">
                          La edad es requerida
                        </mat-error>
                        <mat-error *ngIf="personalForm.get('age')?.hasError('min')">
                          Edad mínima: 13 años
                        </mat-error>
                        <mat-error *ngIf="personalForm.get('age')?.hasError('max')">
                          Edad máxima: 120 años
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Género</mat-label>
                        <mat-select formControlName="gender" required>
                          <mat-option value="M">Masculino</mat-option>
                          <mat-option value="F">Femenino</mat-option>
                        </mat-select>
                        <mat-icon matSuffix>wc</mat-icon>
                        <mat-error *ngIf="personalForm.get('gender')?.hasError('required')">
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
                      <mat-icon matSuffix>accessibility</mat-icon>
                    </mat-form-field>

                    <div class="form-actions">
                      <button mat-raised-button 
                              color="primary" 
                              type="submit" 
                              [disabled]="personalForm.invalid || isUpdatingPersonal">
                        <mat-icon>save</mat-icon>
                        {{isUpdatingPersonal ? 'Guardando...' : 'Guardar Cambios'}}
                      </button>
                      
                      <button mat-button 
                              type="button" 
                              (click)="resetPersonalForm()">
                        <mat-icon>refresh</mat-icon>
                        Restaurar
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Pestaña de Seguridad -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>security</mat-icon>
              Seguridad
            </ng-template>
            
            <div class="tab-content">
              <!-- Cambio de Email -->
              <mat-card class="form-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>email</mat-icon>
                    Cambiar Email
                  </mat-card-title>
                </mat-card-header>
                
                <mat-card-content>
                  <form [formGroup]="emailForm" (ngSubmit)="onUpdateEmail()">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Email Actual</mat-label>
                      <input matInput [value]="currentUser.email" disabled>
                      <mat-icon matSuffix>email</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Nuevo Email</mat-label>
                      <input matInput type="email" formControlName="newEmail" required>
                      <mat-icon matSuffix>email</mat-icon>
                      <mat-error *ngIf="emailForm.get('newEmail')?.hasError('required')">
                        El nuevo email es requerido
                      </mat-error>
                      <mat-error *ngIf="emailForm.get('newEmail')?.hasError('email')">
                        Ingrese un email válido
                      </mat-error>
                    </mat-form-field>

                    <div class="form-actions">
                      <button mat-raised-button 
                              color="primary" 
                              type="submit" 
                              [disabled]="emailForm.invalid || isUpdatingEmail">
                        <mat-icon>save</mat-icon>
                        {{isUpdatingEmail ? 'Actualizando...' : 'Actualizar Email'}}
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>

              <!-- Cambio de Contraseña -->
              <mat-card class="form-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>lock</mat-icon>
                    Cambiar Contraseña
                  </mat-card-title>
                </mat-card-header>
                
                <mat-card-content>
                  <form [formGroup]="passwordForm" (ngSubmit)="onUpdatePassword()">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Contraseña Actual</mat-label>
                      <input matInput 
                             [type]="hideCurrentPassword ? 'password' : 'text'" 
                             formControlName="currentPassword" 
                             required>
                      <button mat-icon-button matSuffix 
                              (click)="hideCurrentPassword = !hideCurrentPassword" 
                              type="button">
                        <mat-icon>{{hideCurrentPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                      </button>
                      <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                        La contraseña actual es requerida
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Nueva Contraseña</mat-label>
                      <input matInput 
                             [type]="hideNewPassword ? 'password' : 'text'" 
                             formControlName="newPassword" 
                             required>
                      <button mat-icon-button matSuffix 
                              (click)="hideNewPassword = !hideNewPassword" 
                              type="button">
                        <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                      </button>
                      <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                        La nueva contraseña es requerida
                      </mat-error>
                      <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                        La contraseña debe tener al menos 6 caracteres
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Confirmar Nueva Contraseña</mat-label>
                      <input matInput 
                             [type]="hideConfirmPassword ? 'password' : 'text'" 
                             formControlName="confirmPassword" 
                             required>
                      <button mat-icon-button matSuffix 
                              (click)="hideConfirmPassword = !hideConfirmPassword" 
                              type="button">
                        <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                      </button>
                      <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                        Confirma tu nueva contraseña
                      </mat-error>
                      <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
                        Las contraseñas no coinciden
                      </mat-error>
                    </mat-form-field>

                    <div class="form-actions">
                      <button mat-raised-button 
                              color="primary" 
                              type="submit" 
                              [disabled]="passwordForm.invalid || isUpdatingPassword">
                        <mat-icon>save</mat-icon>
                        {{isUpdatingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}}
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Pestaña de Configuración -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>settings</mat-icon>
              Configuración
            </ng-template>
            
            <div class="tab-content">
              <mat-card class="form-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>settings</mat-icon>
                    Configuración de la Cuenta
                  </mat-card-title>
                </mat-card-header>
                
                <mat-card-content>
                  <div class="settings-section">
                    <h3>Estadísticas de la Cuenta</h3>
                    <div class="stats-grid">
                      <div class="stat-item">
                        <mat-icon>calendar_today</mat-icon>
                        <div class="stat-info">
                          <span class="stat-label">Miembro desde</span>
                          <span class="stat-value">Enero 2024</span>
                        </div>
                      </div>
                      
                      <div class="stat-item">
                        <mat-icon>timeline</mat-icon>
                        <div class="stat-info">
                          <span class="stat-label">Registros de IMC</span>
                          <span class="stat-value">15</span>
                        </div>
                      </div>
                      
                      <div class="stat-item">
                        <mat-icon>fitness_center</mat-icon>
                        <div class="stat-info">
                          <span class="stat-label">Rutinas completadas</span>
                          <span class="stat-value">8</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="settings-section">
                    <h3>Acciones de la Cuenta</h3>
                    <div class="action-buttons">
                      <button mat-stroked-button color="warn" (click)="exportData()">
                        <mat-icon>download</mat-icon>
                        Exportar Mis Datos
                      </button>
                      
                      <button mat-stroked-button color="warn" (click)="deleteAccount()">
                        <mat-icon>delete_forever</mat-icon>
                        Eliminar Cuenta
                      </button>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .profile-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 10px;
    }

    .profile-header p {
      font-size: 1.1rem;
      color: #666;
    }

    .tab-content {
      padding: 20px 0;
    }

    .avatar-card {
      margin-bottom: 20px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .avatar-container {
      position: relative;
    }

    .avatar-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #667eea;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 3rem;
    }

    .avatar-edit-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 40px;
      height: 40px;
      min-height: 40px;
    }

    .avatar-info h2 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .user-email {
      color: #667eea;
      font-weight: 500;
      margin: 5px 0;
    }

    .user-details {
      color: #666;
      margin: 5px 0 0 0;
    }

    .form-card {
      margin-bottom: 20px;
    }

    .form-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .half-width {
      flex: 1;
      margin-bottom: 15px;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 20px;
      justify-content: flex-start;
    }

    .settings-section {
      margin-bottom: 30px;
    }

    .settings-section h3 {
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f0f0f0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .stat-item mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #667eea;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }

    .stat-value {
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .avatar-section {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }

      .profile-header h1 {
        font-size: 2rem;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  personalForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;
  disabilities: Disability[] = [];
  
  isUpdatingPersonal = false;
  isUpdatingEmail = false;
  isUpdatingPassword = false;
  
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private recommendationService: RecommendationService,
    private snackBar: MatSnackBar
  ) {
    this.personalForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(13), Validators.max(120)]],
      gender: ['', [Validators.required]],
      idDisability: [null]
    });

    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadPersonalForm();
      }
    });
    
    this.loadDisabilities();
  }

  loadPersonalForm(): void {
    if (this.currentUser?.person) {
      this.personalForm.patchValue({
        name: this.currentUser.person.name,
        lastname: this.currentUser.person.lastname,
        age: this.currentUser.person.age,
        gender: this.currentUser.person.gender,
        idDisability: this.currentUser.person.idDisability
      });
    }
  }

  loadDisabilities(): void {
    this.recommendationService.getDisabilities().subscribe({
      next: (disabilities) => {
        this.disabilities = disabilities;
      },
      error: (error) => {
        console.error('Error al cargar discapacidades:', error);
        // Datos mock
        this.disabilities = [
          { id: 1, name: 'Ceguera' },
          { id: 2, name: 'Movilidad reducida' },
          { id: 3, name: 'Discapacidad auditiva' },
          { id: 4, name: 'Discapacidad cognitiva' }
        ];
      }
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onUpdatePersonal(): void {
    if (this.personalForm.valid) {
      this.isUpdatingPersonal = true;
      
      // Simular actualización
      setTimeout(() => {
        this.isUpdatingPersonal = false;
        this.snackBar.open('Información personal actualizada exitosamente', 'Cerrar', {
          duration: 3000
        });
      }, 2000);
    }
  }

  onUpdateEmail(): void {
    if (this.emailForm.valid) {
      this.isUpdatingEmail = true;
      
      // Simular actualización
      setTimeout(() => {
        this.isUpdatingEmail = false;
        this.snackBar.open('Email actualizado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.emailForm.reset();
      }, 2000);
    }
  }

  onUpdatePassword(): void {
    if (this.passwordForm.valid) {
      this.isUpdatingPassword = true;
      
      // Simular actualización
      setTimeout(() => {
        this.isUpdatingPassword = false;
        this.snackBar.open('Contraseña actualizada exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.passwordForm.reset();
      }, 2000);
    }
  }

  resetPersonalForm(): void {
    this.loadPersonalForm();
  }

  getAvatarImage(): string {
    if (this.currentUser?.image) {
      return `url(${this.currentUser.image})`;
    }
    return '';
  }

  exportData(): void {
    this.snackBar.open('Exportando datos del usuario...', 'Cerrar', {
      duration: 3000
    });
    // Implementar lógica de exportación
  }

  deleteAccount(): void {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.snackBar.open('Funcionalidad de eliminación no implementada en la demo', 'Cerrar', {
        duration: 5000
      });
    }
  }
}
