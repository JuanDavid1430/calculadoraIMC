import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { IMCService } from '../../services/imc.service';
import { AuthService } from '../../services/auth.service';
import { History } from '../../models/imc.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="history-container">
      <div class="history-header">
        <h1>Historial de IMC</h1>
        <p>Revisa tu progreso y evolución a lo largo del tiempo</p>
      </div>

      <div class="history-content">
        <!-- Estadísticas Generales -->
        <div class="stats-cards" *ngIf="historyData.length > 0">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">fitness_center</mat-icon>
                <div class="stat-info">
                  <div class="stat-value">{{getLatestIMC() | number:'1.1-1'}}</div>
                  <div class="stat-label">IMC Actual</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">timeline</mat-icon>
                <div class="stat-info">
                  <div class="stat-value">{{historyData.length}}</div>
                  <div class="stat-label">Registros</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">trending_up</mat-icon>
                <div class="stat-info">
                  <div class="stat-value" [class]="getTrendClass()">{{getTrend()}}</div>
                  <div class="stat-label">Tendencia</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">date_range</mat-icon>
                <div class="stat-info">
                  <div class="stat-value">{{getLastUpdateDays()}}</div>
                  <div class="stat-label">Días desde último registro</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Tabla de Historial -->
        <mat-card class="history-table-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>history</mat-icon>
              Historial Completo
            </mat-card-title>
            <mat-card-subtitle>
              Todos tus registros de IMC ordenados por fecha
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div *ngIf="isLoading" class="loading-container">
              <mat-spinner></mat-spinner>
              <p>Cargando historial...</p>
            </div>

            <div *ngIf="!isLoading && historyData.length === 0" class="empty-state">
              <mat-icon>history_toggle_off</mat-icon>
              <h3>Sin registros de IMC</h3>
              <p>Aún no tienes registros de IMC. Utiliza la calculadora para crear tu primer registro.</p>
              <button mat-raised-button color="primary" routerLink="/dashboard/calculator">
                <mat-icon>calculate</mat-icon>
                Calcular IMC
              </button>
            </div>

            <div *ngIf="!isLoading && historyData.length > 0" class="table-container">
              <table mat-table [dataSource]="historyData" class="history-table">
                <!-- Fecha Column -->
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Fecha</th>
                  <td mat-cell *matCellDef="let element">
                    <div class="date-cell">
                      <mat-icon>event</mat-icon>
                      <span>{{element.createdDate | date:'dd/MM/yyyy'}}</span>
                      <small>{{element.createdDate | date:'HH:mm'}}</small>
                    </div>
                  </td>
                </ng-container>

                <!-- Peso Column -->
                <ng-container matColumnDef="weight">
                  <th mat-header-cell *matHeaderCellDef>Peso</th>
                  <td mat-cell *matCellDef="let element">
                    <div class="metric-cell">
                      <mat-icon>monitor_weight</mat-icon>
                      <span>{{element.weight}} kg</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Altura Column -->
                <ng-container matColumnDef="height">
                  <th mat-header-cell *matHeaderCellDef>Altura</th>
                  <td mat-cell *matCellDef="let element">
                    <div class="metric-cell">
                      <mat-icon>height</mat-icon>
                      <span>{{element.height}} cm</span>
                    </div>
                  </td>
                </ng-container>

                <!-- IMC Column -->
                <ng-container matColumnDef="imc">
                  <th mat-header-cell *matHeaderCellDef>IMC</th>
                  <td mat-cell *matCellDef="let element">
                    <div class="imc-cell">
                      <span class="imc-value" [class]="getIMCClass(element.imc)">
                        {{element.imc | number:'1.1-1'}}
                      </span>
                    </div>
                  </td>
                </ng-container>

                <!-- Clasificación Column -->
                <ng-container matColumnDef="classification">
                  <th mat-header-cell *matHeaderCellDef>Clasificación</th>
                  <td mat-cell *matCellDef="let element">
                    <mat-chip-set>
                      <mat-chip [class]="getIMCClass(element.imc)" disabled>
                        {{getIMCClassification(element.imc)}}
                      </mat-chip>
                    </mat-chip-set>
                  </td>
                </ng-container>

                <!-- Diferencia Column -->
                <ng-container matColumnDef="difference">
                  <th mat-header-cell *matHeaderCellDef>Cambio</th>
                  <td mat-cell *matCellDef="let element; let i = index">
                    <div class="difference-cell" *ngIf="i < historyData.length - 1">
                      <span class="difference-value" [class]="getDifferenceClass(element, i)">
                        <mat-icon>{{getDifferenceIcon(element, i)}}</mat-icon>
                        {{getDifferenceValue(element, i) | number:'1.1-1'}}
                      </span>
                    </div>
                    <div class="difference-cell" *ngIf="i === historyData.length - 1">
                      <span class="first-record">Primer registro</span>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .history-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .history-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 10px;
    }

    .history-header p {
      font-size: 1.1rem;
      color: #666;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #667eea;
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
      margin-top: 5px;
    }

    .history-table-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .loading-container {
      text-align: center;
      padding: 40px;
    }

    .loading-container p {
      margin-top: 15px;
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

    .empty-state h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 30px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .table-container {
      overflow-x: auto;
    }

    .history-table {
      width: 100%;
      min-width: 700px;
    }

    .date-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-direction: column;
      text-align: center;
    }

    .date-cell small {
      color: #666;
      font-size: 0.8rem;
    }

    .metric-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .imc-cell {
      text-align: center;
    }

    .imc-value {
      font-size: 1.2rem;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .difference-cell {
      text-align: center;
    }

    .difference-value {
      display: flex;
      align-items: center;
      gap: 4px;
      justify-content: center;
      font-weight: 500;
    }

    .first-record {
      color: #666;
      font-style: italic;
      font-size: 0.9rem;
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

    /* Clases para tendencias */
    .trend-up {
      color: #F44336;
    }

    .trend-down {
      color: #4CAF50;
    }

    .trend-stable {
      color: #666;
    }

    /* Clases para diferencias */
    .difference-positive {
      color: #F44336;
    }

    .difference-negative {
      color: #4CAF50;
    }

    .difference-stable {
      color: #666;
    }

    @media (max-width: 768px) {
      .stats-cards {
        grid-template-columns: 1fr;
      }

      .history-header h1 {
        font-size: 2rem;
      }

      .stat-content {
        gap: 10px;
      }

      .stat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }
    }
  `]
})
export class HistoryComponent implements OnInit {
  historyData: History[] = [];
  isLoading = true;
  displayedColumns: string[] = ['date', 'weight', 'height', 'imc', 'classification', 'difference'];

  constructor(
    private imcService: IMCService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.imcService.getHistory(currentUser.id!).subscribe({
        next: (history) => {
          this.historyData = history.sort((a, b) => 
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
          );
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar historial:', error);
          this.isLoading = false;
          // Datos mock para testing
          this.generateMockData();
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  private generateMockData(): void {
    const mockData: History[] = [
      {
        id: 1,
        idUser: 1,
        weight: 75,
        height: 175,
        imc: 24.49,
        createdDate: new Date('2024-01-15')
      },
      {
        id: 2,
        idUser: 1,
        weight: 73,
        height: 175,
        imc: 23.84,
        createdDate: new Date('2024-02-15')
      },
      {
        id: 3,
        idUser: 1,
        weight: 72,
        height: 175,
        imc: 23.51,
        createdDate: new Date('2024-03-15')
      }
    ];
    this.historyData = mockData.sort((a, b) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  getLatestIMC(): number {
    return this.historyData.length > 0 ? this.historyData[0].imc : 0;
  }

  getTrend(): string {
    if (this.historyData.length < 2) return 'N/A';
    
    const latest = this.historyData[0].imc;
    const previous = this.historyData[1].imc;
    const diff = latest - previous;
    
    if (Math.abs(diff) < 0.1) return 'Estable';
    return diff > 0 ? 'Subiendo' : 'Bajando';
  }

  getTrendClass(): string {
    const trend = this.getTrend();
    if (trend === 'Subiendo') return 'trend-up';
    if (trend === 'Bajando') return 'trend-down';
    return 'trend-stable';
  }

  getLastUpdateDays(): number {
    if (this.historyData.length === 0) return 0;
    
    const lastDate = new Date(this.historyData[0].createdDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getIMCClass(imc: number): string {
    if (imc < 18.5) return 'underweight';
    if (imc < 25) return 'normal';
    if (imc < 30) return 'overweight';
    if (imc < 35) return 'obesity1';
    if (imc < 40) return 'obesity2';
    return 'obesity3';
  }

  getIMCClassification(imc: number): string {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidad I';
    if (imc < 40) return 'Obesidad II';
    return 'Obesidad III';
  }

  getDifferenceValue(element: History, index: number): number {
    if (index >= this.historyData.length - 1) return 0;
    return element.imc - this.historyData[index + 1].imc;
  }

  getDifferenceClass(element: History, index: number): string {
    const diff = this.getDifferenceValue(element, index);
    if (Math.abs(diff) < 0.1) return 'difference-stable';
    return diff > 0 ? 'difference-positive' : 'difference-negative';
  }

  getDifferenceIcon(element: History, index: number): string {
    const diff = this.getDifferenceValue(element, index);
    if (Math.abs(diff) < 0.1) return 'remove';
    return diff > 0 ? 'arrow_upward' : 'arrow_downward';
  }
}
