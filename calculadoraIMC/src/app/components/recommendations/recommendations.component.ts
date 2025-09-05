import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { RecommendationService } from '../../services/recommendation.service';
import { AuthService } from '../../services/auth.service';
import { Recommendation, Rutine, Diet } from '../../models/recommendation.model';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatExpansionModule
  ],
  template: `
    <div class="recommendations-container">
      <div class="recommendations-header">
        <h1>Recomendaciones Personalizadas</h1>
        <p>Rutinas de ejercicio y planes alimenticios adaptados a tu perfil</p>
      </div>

      <div class="recommendations-content">
        <!-- Estado de carga -->
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Generando recomendaciones personalizadas...</p>
        </div>

        <!-- Información del usuario actual -->
        <mat-card *ngIf="!isLoading && recommendation" class="user-info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>person</mat-icon>
              Tu Perfil Actual
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="profile-info">
              <div class="info-item">
                <mat-icon>fitness_center</mat-icon>
                <span class="label">IMC Actual:</span>
                <span class="value imc-value" [class]="getIMCClass(recommendation.currentIMC)">
                  {{recommendation.currentIMC | number:'1.1-1'}}
                </span>
              </div>
              <div class="info-item">
                <mat-icon>category</mat-icon>
                <span class="label">Clasificación:</span>
                <mat-chip-set>
                  <mat-chip [class]="getIMCClass(recommendation.currentIMC)" disabled>
                    {{recommendation.classification}}
                  </mat-chip>
                </mat-chip-set>
              </div>
              <div class="info-item" *ngIf="currentUser?.person">
                <mat-icon>person_outline</mat-icon>
                <span class="label">Perfil:</span>
                <span class="value">
                  {{currentUser.person.age}} años, 
                  {{currentUser.person.gender === 'M' ? 'Masculino' : 'Femenino'}}
                  <span *ngIf="currentUser.person.disability">, {{currentUser.person.disability.name}}</span>
                </span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Recomendaciones en pestañas -->
        <mat-card *ngIf="!isLoading && recommendation" class="recommendations-card">
          <mat-tab-group>
            <!-- Pestaña de Rutinas -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>fitness_center</mat-icon>
                Rutinas de Ejercicio
              </ng-template>
              
              <div class="tab-content">
                <div class="tab-header">
                  <h2>Rutinas Recomendadas</h2>
                  <p>Ejercicios adaptados a tu nivel y condición física</p>
                </div>

                <div *ngIf="recommendation.rutines.length === 0" class="empty-state">
                  <mat-icon>fitness_center</mat-icon>
                  <h3>No hay rutinas disponibles</h3>
                  <p>En este momento no tenemos rutinas específicas para tu perfil.</p>
                </div>

                <mat-accordion *ngIf="recommendation.rutines.length > 0">
                  <mat-expansion-panel *ngFor="let rutina of recommendation.rutines; let i = index">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>{{getRutinaIcon(i)}}</mat-icon>
                        {{rutina.name}}
                      </mat-panel-title>
                      <mat-panel-description>
                        Nivel de IMC: {{getClassLetter(rutina.idClass)}}
                      </mat-panel-description>
                    </mat-expansion-panel-header>
                    
                    <div class="rutina-content">
                      <p class="rutina-description">{{rutina.description}}</p>
                      
                      <div class="rutina-details">
                        <div class="detail-chip">
                          <mat-icon>timer</mat-icon>
                          <span>45-60 min</span>
                        </div>
                        <div class="detail-chip">
                          <mat-icon>repeat</mat-icon>
                          <span>3-4 veces/semana</span>
                        </div>
                        <div class="detail-chip">
                          <mat-icon>trending_up</mat-icon>
                          <span>Progresivo</span>
                        </div>
                      </div>

                      <div class="rutina-actions">
                        <button mat-raised-button color="primary">
                          <mat-icon>play_arrow</mat-icon>
                          Comenzar Rutina
                        </button>
                        <button mat-button>
                          <mat-icon>favorite_border</mat-icon>
                          Guardar
                        </button>
                      </div>
                    </div>
                  </mat-expansion-panel>
                </mat-accordion>
              </div>
            </mat-tab>

            <!-- Pestaña de Dietas -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>restaurant</mat-icon>
                Planes Alimenticios
              </ng-template>
              
              <div class="tab-content">
                <div class="tab-header">
                  <h2>Planes Alimenticios</h2>
                  <p>Dietas balanceadas según tus objetivos nutricionales</p>
                </div>

                <div *ngIf="recommendation.diets.length === 0" class="empty-state">
                  <mat-icon>restaurant</mat-icon>
                  <h3>No hay dietas disponibles</h3>
                  <p>En este momento no tenemos planes alimenticios específicos para tu perfil.</p>
                </div>

                <mat-accordion *ngIf="recommendation.diets.length > 0">
                  <mat-expansion-panel *ngFor="let dieta of recommendation.diets; let i = index">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>{{getDietaIcon(i)}}</mat-icon>
                        {{dieta.name}}
                      </mat-panel-title>
                      <mat-panel-description>
                        Nivel de IMC: {{getClassLetter(dieta.idClass)}}
                      </mat-panel-description>
                    </mat-expansion-panel-header>
                    
                    <div class="dieta-content">
                      <p class="dieta-description">{{dieta.description}}</p>
                      
                      <div class="dieta-details">
                        <div class="detail-chip">
                          <mat-icon>schedule</mat-icon>
                          <span>5-6 comidas/día</span>
                        </div>
                        <div class="detail-chip">
                          <mat-icon>local_drink</mat-icon>
                          <span>2-3L agua</span>
                        </div>
                        <div class="detail-chip">
                          <mat-icon>eco</mat-icon>
                          <span>Balanceada</span>
                        </div>
                      </div>

                      <div class="nutrition-info">
                        <h4>Distribución Nutricional Sugerida:</h4>
                        <div class="nutrition-grid">
                          <div class="nutrition-item">
                            <span class="nutrition-label">Proteínas</span>
                            <span class="nutrition-value">25-30%</span>
                          </div>
                          <div class="nutrition-item">
                            <span class="nutrition-label">Carbohidratos</span>
                            <span class="nutrition-value">45-50%</span>
                          </div>
                          <div class="nutrition-item">
                            <span class="nutrition-label">Grasas</span>
                            <span class="nutrition-value">20-25%</span>
                          </div>
                        </div>
                      </div>

                      <div class="dieta-actions">
                        <button mat-raised-button color="accent">
                          <mat-icon>restaurant_menu</mat-icon>
                          Ver Menú Completo
                        </button>
                        <button mat-button>
                          <mat-icon>favorite_border</mat-icon>
                          Guardar
                        </button>
                      </div>
                    </div>
                  </mat-expansion-panel>
                </mat-accordion>
              </div>
            </mat-tab>

            <!-- Pestaña de Consejos -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>lightbulb</mat-icon>
                Consejos
              </ng-template>
              
              <div class="tab-content">
                <div class="tab-header">
                  <h2>Consejos Personalizados</h2>
                  <p>Recomendaciones adicionales para mejorar tu bienestar</p>
                </div>

                <div class="tips-grid">
                  <mat-card class="tip-card">
                    <mat-card-header>
                      <mat-icon mat-card-avatar>water_drop</mat-icon>
                      <mat-card-title>Hidratación</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <p>Mantén una hidratación adecuada bebiendo al menos 2-3 litros de agua al día, especialmente durante el ejercicio.</p>
                    </mat-card-content>
                  </mat-card>

                  <mat-card class="tip-card">
                    <mat-card-header>
                      <mat-icon mat-card-avatar>bedtime</mat-icon>
                      <mat-card-title>Descanso</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <p>Asegúrate de dormir 7-8 horas diarias. El descanso adecuado es crucial para la recuperación muscular y el metabolismo.</p>
                    </mat-card-content>
                  </mat-card>

                  <mat-card class="tip-card">
                    <mat-card-header>
                      <mat-icon mat-card-avatar>psychology</mat-icon>
                      <mat-card-title>Constancia</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <p>Los resultados se ven con el tiempo. Mantén una rutina constante y registra tu progreso regularmente.</p>
                    </mat-card-content>
                  </mat-card>

                  <mat-card class="tip-card">
                    <mat-card-header>
                      <mat-icon mat-card-avatar>medical_information</mat-icon>
                      <mat-card-title>Consulta Médica</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <p>Antes de iniciar cualquier programa, consulta con un profesional de la salud, especialmente si tienes condiciones médicas.</p>
                    </mat-card-content>
                  </mat-card>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card>

        <!-- Estado sin recomendaciones -->
        <div *ngIf="!isLoading && !recommendation" class="no-recommendations">
          <mat-card class="empty-card">
            <mat-card-content>
              <mat-icon>info</mat-icon>
              <h3>Sin recomendaciones disponibles</h3>
              <p>Para generar recomendaciones personalizadas, primero calcula tu IMC.</p>
              <button mat-raised-button color="primary" routerLink="/dashboard/calculator">
                <mat-icon>calculate</mat-icon>
                Calcular IMC
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recommendations-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .recommendations-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .recommendations-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 10px;
    }

    .recommendations-header p {
      font-size: 1.1rem;
      color: #666;
    }

    .loading-container {
      text-align: center;
      padding: 60px;
    }

    .loading-container p {
      margin-top: 20px;
      color: #666;
    }

    .user-info-card {
      margin-bottom: 20px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .user-info-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .profile-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 15px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
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

    .imc-value {
      font-size: 1.2rem;
    }

    .recommendations-card {
      margin-top: 20px;
    }

    .tab-content {
      padding: 20px 0;
    }

    .tab-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .tab-header h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .tab-header p {
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 20px;
    }

    .rutina-content, .dieta-content {
      padding: 20px 0;
    }

    .rutina-description, .dieta-description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #555;
      margin-bottom: 20px;
    }

    .rutina-details, .dieta-details {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .detail-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #f0f0f0;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .detail-chip mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .nutrition-info {
      margin: 20px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .nutrition-info h4 {
      margin-bottom: 15px;
      color: #333;
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }

    .nutrition-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background: white;
      border-radius: 6px;
    }

    .nutrition-label {
      color: #666;
    }

    .nutrition-value {
      font-weight: bold;
      color: #333;
    }

    .rutina-actions, .dieta-actions {
      display: flex;
      gap: 15px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .tips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .tip-card {
      height: fit-content;
    }

    .tip-card mat-icon[mat-card-avatar] {
      font-size: 2rem;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #667eea;
      color: white;
      border-radius: 50%;
    }

    .no-recommendations {
      text-align: center;
      padding: 40px;
    }

    .empty-card {
      max-width: 500px;
      margin: 0 auto;
      padding: 40px;
      text-align: center;
    }

    .empty-card mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 20px;
    }

    /* Clases de colores para IMC */
    .underweight {
      color: #2196F3;
      background: rgba(33, 150, 243, 0.1);
    }

    .normal {
      color: #4CAF50;
      background: rgba(76, 175, 80, 0.1);
    }

    .overweight {
      color: #FF9800;
      background: rgba(255, 152, 0, 0.1);
    }

    .obesity1, .obesity2, .obesity3 {
      color: #F44336;
      background: rgba(244, 67, 54, 0.1);
    }

    @media (max-width: 768px) {
      .profile-info {
        grid-template-columns: 1fr;
      }

      .rutina-details, .dieta-details {
        flex-direction: column;
        gap: 10px;
      }

      .rutina-actions, .dieta-actions {
        flex-direction: column;
      }

      .tips-grid {
        grid-template-columns: 1fr;
      }

      .recommendations-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class RecommendationsComponent implements OnInit {
  recommendation: Recommendation | null = null;
  isLoading = true;
  currentUser: any = null;

  constructor(
    private recommendationService: RecommendationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    if (this.currentUser) {
      this.recommendationService.getRecommendations(this.currentUser.id!).subscribe({
        next: (recommendation) => {
          this.recommendation = recommendation;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar recomendaciones:', error);
          this.isLoading = false;
          // Datos mock para testing
          this.generateMockRecommendations();
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  private generateMockRecommendations(): void {
    this.recommendation = {
      currentIMC: 23.5,
      classification: 'Peso normal',
      rutines: [
        {
          id: 1,
          name: 'Rutina de Mantenimiento',
          description: 'Rutina equilibrada para mantener tu peso actual y mejorar la condición física general. Incluye ejercicios cardiovasculares y de fuerza.',
          idClass: 1
        },
        {
          id: 2,
          name: 'Entrenamiento Funcional',
          description: 'Ejercicios que mejoran la funcionalidad del cuerpo en movimientos cotidianos, fortaleciendo core y estabilidad.',
          idClass: 1
        }
      ],
      diets: [
        {
          id: 1,
          name: 'Dieta Mediterránea Balanceada',
          description: 'Plan alimenticio basado en la dieta mediterránea, rica en frutas, verduras, pescado y aceite de oliva. Ideal para mantener un peso saludable.',
          idClass: 1
        },
        {
          id: 2,
          name: 'Plan Nutritivo Equilibrado',
          description: 'Dieta balanceada con todos los macronutrientes necesarios, adaptada para personas con peso normal que buscan mantener su estado físico.',
          idClass: 1
        }
      ]
    };
  }

  getIMCClass(imc: number): string {
    if (imc < 18.5) return 'underweight';
    if (imc < 25) return 'normal';
    if (imc < 30) return 'overweight';
    if (imc < 35) return 'obesity1';
    if (imc < 40) return 'obesity2';
    return 'obesity3';
  }

  getClassLetter(classId: number): string {
    // Mock data - en producción esto vendría del backend
    const classes = ['A', 'B', 'C', 'D', 'E'];
    return classes[classId - 1] || 'A';
  }

  getRutinaIcon(index: number): string {
    const icons = ['fitness_center', 'sports_gymnastics', 'directions_run', 'pool', 'sports_martial_arts'];
    return icons[index % icons.length];
  }

  getDietaIcon(index: number): string {
    const icons = ['restaurant', 'local_dining', 'breakfast_dining', 'lunch_dining', 'dinner_dining'];
    return icons[index % icons.length];
  }
}
