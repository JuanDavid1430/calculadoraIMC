import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMCService } from '../../services/imc.service';
import { AuthService } from '../../services/auth.service';
import { IMCRequest, IMCResponse } from '../../models/imc.model';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="calculator-container">
      <div class="calculator-header">
        <h1>Calculadora de IMC</h1>
        <p>Calcula tu Índice de Masa Corporal y conoce tu estado físico</p>
      </div>

      <div class="calculator-content">
        <!-- Formulario de Cálculo -->
        <mat-card class="calculator-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>calculate</mat-icon>
              Calculadora IMC
            </mat-card-title>
            <mat-card-subtitle>Ingresa tu peso y altura actuales</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="calculatorForm" (ngSubmit)="onCalculate()">
              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Peso (kg)</mat-label>
                  <input matInput 
                         type="number" 
                         formControlName="weight" 
                         step="0.1"
                         min="30"
                         max="300"
                         required>
                  <mat-icon matSuffix>monitor_weight</mat-icon>
                  <mat-error *ngIf="calculatorForm.get('weight')?.hasError('required')">
                    El peso es requerido
                  </mat-error>
                  <mat-error *ngIf="calculatorForm.get('weight')?.hasError('min')">
                    Peso mínimo: 30 kg
                  </mat-error>
                  <mat-error *ngIf="calculatorForm.get('weight')?.hasError('max')">
                    Peso máximo: 300 kg
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Altura (m)</mat-label>
                  <input matInput 
                         type="number" 
                         formControlName="height" 
                         step="0.01"
                         min="1.0"
                         max="2.5"
                         placeholder="Ej: 1.75"
                         required>
                  <mat-icon matSuffix>height</mat-icon>
                  <mat-error *ngIf="calculatorForm.get('height')?.hasError('required')">
                    La altura es requerida
                  </mat-error>
                  <mat-error *ngIf="calculatorForm.get('height')?.hasError('min')">
                    Altura mínima: 1.0 m
                  </mat-error>
                  <mat-error *ngIf="calculatorForm.get('height')?.hasError('max')">
                    Altura máxima: 2.5 m
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="button-container">
                <button mat-raised-button 
                        color="primary" 
                        type="submit" 
                        [disabled]="calculatorForm.invalid || isCalculating"
                        class="calculate-btn">
                  <mat-spinner *ngIf="isCalculating" diameter="20"></mat-spinner>
                  <mat-icon *ngIf="!isCalculating">calculate</mat-icon>
                  {{isCalculating ? 'Calculando...' : 'Calcular IMC'}}
                </button>

                <button mat-button 
                        type="button" 
                        (click)="clearForm()"
                        [disabled]="isCalculating">
                  <mat-icon>clear</mat-icon>
                  Limpiar
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Resultado del Cálculo -->
        <mat-card *ngIf="result" class="result-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon [class]="getResultIconClass()">{{getResultIcon()}}</mat-icon>
              Resultado del IMC
            </mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <div class="result-display">
              <div class="imc-value" [class]="getIMCClass()">
                {{result.imc | number:'1.1-1'}}
              </div>
              <div class="imc-classification" [class]="getIMCClass()">
                {{result.classification}}
              </div>
            </div>

            <div class="result-details">
              <div class="detail-item">
                <span class="label">Peso:</span>
                <span class="value">{{result.weight}} kg</span>
              </div>
              <div class="detail-item">
                <span class="label">Altura:</span>
                <span class="value">{{result.height}} m</span>
              </div>
              <div class="detail-item">
                <span class="label">Fecha:</span>
                <span class="value">{{result.createdDate | date:'dd/MM/yyyy HH:mm'}}</span>
              </div>
            </div>

            <div class="recommendations-link">
              <button mat-raised-button 
                      color="accent" 
                      routerLink="/dashboard/recommendations">
                <mat-icon>fitness_center</mat-icon>
                Ver Recomendaciones
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Información sobre el IMC -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>info</mat-icon>
              Información sobre el IMC
            </mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <div class="imc-ranges">
              <div class="range-item underweight">
                <span class="range-label">Bajo peso</span>
                <span class="range-value">&lt; 18.5</span>
              </div>
              <div class="range-item normal">
                <span class="range-label">Peso normal</span>
                <span class="range-value">18.5 - 24.9</span>
              </div>
              <div class="range-item overweight">
                <span class="range-label">Sobrepeso</span>
                <span class="range-value">25.0 - 29.9</span>
              </div>
              <div class="range-item obesity1">
                <span class="range-label">Obesidad I</span>
                <span class="range-value">30.0 - 34.9</span>
              </div>
              <div class="range-item obesity2">
                <span class="range-label">Obesidad II</span>
                <span class="range-value">35.0 - 39.9</span>
              </div>
              <div class="range-item obesity3">
                <span class="range-label">Obesidad III</span>
                <span class="range-value">≥ 40.0</span>
              </div>
            </div>

            <p class="info-text">
              El Índice de Masa Corporal (IMC) es una medida que relaciona el peso y la altura 
              para evaluar si una persona tiene un peso saludable. Es importante recordar que 
              el IMC es solo una guía y no considera factores como la masa muscular o la composición corporal.
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .calculator-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .calculator-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .calculator-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 10px;
    }

    .calculator-header p {
      font-size: 1.1rem;
      color: #666;
    }

    .calculator-content {
      display: grid;
      gap: 20px;
    }

    .calculator-card, .result-card, .info-card {
      max-width: 100%;
    }

    .calculator-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .half-width {
      flex: 1;
    }

    .button-container {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 20px;
    }

    .calculate-btn {
      min-width: 150px;
      height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .result-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .result-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .result-display {
      text-align: center;
      margin: 20px 0;
    }

    .imc-value {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .imc-classification {
      font-size: 1.5rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .result-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background: white;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .label {
      font-weight: 500;
      color: #666;
    }

    .value {
      font-weight: bold;
      color: #333;
    }

    .recommendations-link {
      text-align: center;
      margin-top: 20px;
    }

    .info-card {
      margin-top: 20px;
    }

    .info-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .imc-ranges {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }

    .range-item {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      border-radius: 8px;
      border-left: 4px solid;
    }

    .range-label {
      font-weight: 500;
    }

    .range-value {
      font-weight: bold;
    }

    .info-text {
      color: #666;
      line-height: 1.6;
      margin-top: 20px;
    }

    /* Clases de colores para IMC */
    .underweight {
      color: #2196F3;
      border-left-color: #2196F3;
      background: rgba(33, 150, 243, 0.1);
    }

    .normal {
      color: #4CAF50;
      border-left-color: #4CAF50;
      background: rgba(76, 175, 80, 0.1);
    }

    .overweight {
      color: #FF9800;
      border-left-color: #FF9800;
      background: rgba(255, 152, 0, 0.1);
    }

    .obesity1 {
      color: #FF5722;
      border-left-color: #FF5722;
      background: rgba(255, 87, 34, 0.1);
    }

    .obesity2 {
      color: #F44336;
      border-left-color: #F44336;
      background: rgba(244, 67, 54, 0.1);
    }

    .obesity3 {
      color: #9C27B0;
      border-left-color: #9C27B0;
      background: rgba(156, 39, 176, 0.1);
    }

    .icon-normal { color: #4CAF50; }
    .icon-warning { color: #FF9800; }
    .icon-danger { color: #F44336; }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 10px;
      }

      .button-container {
        flex-direction: column;
        align-items: center;
      }

      .imc-ranges {
        grid-template-columns: 1fr;
      }

      .calculator-header h1 {
        font-size: 2rem;
      }

      .imc-value {
        font-size: 2.5rem;
      }

      .imc-classification {
        font-size: 1.2rem;
      }
    }
  `]
})
export class CalculatorComponent implements OnInit {
  calculatorForm: FormGroup;
  isCalculating = false;
  result: IMCResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private imcService: IMCService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.calculatorForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      height: ['', [Validators.required, Validators.min(1.0), Validators.max(2.5)]]
    });
  }

  ngOnInit(): void {
    // Componente inicializado
  }

  onCalculate(): void {
    if (this.calculatorForm.valid) {
      this.isCalculating = true;
      const formData = this.calculatorForm.value;
      const imcData: IMCRequest = {
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height)
      };

      this.imcService.calculateIMC(imcData).subscribe({
        next: (response) => {
          this.isCalculating = false;
          this.result = response;
          this.snackBar.open('IMC calculado exitosamente', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          this.isCalculating = false;
          console.error('Error al calcular IMC:', error);
          
          // Cálculo local como fallback
          const localIMC = this.imcService.calculateLocalIMC(imcData.weight, imcData.height);
          const classification = this.imcService.classifyIMC(localIMC);
          
          this.result = {
            id: 0,
            weight: imcData.weight,
            height: imcData.height,
            imc: localIMC,
            classification: classification,
            createdDate: new Date()
          };
          
          this.snackBar.open('IMC calculado localmente (sin guardar)', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }

  clearForm(): void {
    this.calculatorForm.reset();
    this.result = null;
  }

  getIMCClass(): string {
    if (!this.result) return '';
    
    const imc = this.result.imc;
    if (imc < 18.5) return 'underweight';
    if (imc < 25) return 'normal';
    if (imc < 30) return 'overweight';
    if (imc < 35) return 'obesity1';
    if (imc < 40) return 'obesity2';
    return 'obesity3';
  }

  getResultIcon(): string {
    if (!this.result) return 'info';
    
    const imc = this.result.imc;
    if (imc >= 18.5 && imc < 25) return 'check_circle';
    if (imc < 18.5 || (imc >= 25 && imc < 30)) return 'warning';
    return 'error';
  }

  getResultIconClass(): string {
    if (!this.result) return '';
    
    const imc = this.result.imc;
    if (imc >= 18.5 && imc < 25) return 'icon-normal';
    if (imc < 18.5 || (imc >= 25 && imc < 30)) return 'icon-warning';
    return 'icon-danger';
  }
}
