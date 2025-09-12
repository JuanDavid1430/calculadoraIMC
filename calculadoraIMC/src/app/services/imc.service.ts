import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { History, IMCRequest, IMCResponse, ImcCalculation, ImcResult } from '../models/imc.model';

@Injectable({
  providedIn: 'root'
})
export class IMCService {
  // Array en memoria para almacenar historial
  private historyData: ImcResult[] = [];
  private nextId = 1;

  constructor() {}

  calculateIMC(data: IMCRequest): Observable<IMCResponse> {
    // Calcular IMC localmente
    const imc = this.calculateLocalIMC(data.weight, data.height);
    const classification = this.classifyIMC(imc);
    
    // Crear respuesta
    const response: IMCResponse = {
      id: this.nextId++,
      weight: data.weight,
      height: data.height,
      imc: Math.round(imc * 100) / 100, // Redondear a 2 decimales
      classification: classification,
      createdDate: new Date()
    };

    // Guardar en historial local
    const historyEntry: ImcResult = {
      id: response.id,
      imc: response.imc,
      weight: response.weight,
      height: response.height,
      classification: response.classification,
      date: response.createdDate,
      userId: 1 // Usuario por defecto por ahora
    };
    
    this.historyData.push(historyEntry);

    // Simular delay de red
    return of(response).pipe(delay(500));
  }

  getHistory(userId: number): Observable<History[]> {
    // Filtrar historial por usuario y convertir formato
    const userHistory = this.historyData
      .filter(entry => entry.userId === userId)
      .map(entry => ({
        id: entry.id!,
        idUser: entry.userId,
        weight: entry.weight,
        height: entry.height,
        imc: entry.imc,
        classification: entry.classification,
        createdDate: entry.date
      }));

    return of(userHistory).pipe(delay(300));
  }

  saveCalculation(calculation: ImcCalculation): Observable<ImcResult> {
    const result: ImcResult = {
      id: this.nextId++,
      imc: calculation.imc,
      weight: calculation.weight,
      height: calculation.height,
      classification: calculation.classification,
      date: calculation.date,
      userId: calculation.userId
    };

    this.historyData.push(result);
    return of(result).pipe(delay(300));
  }

  getIMCClasses(): Observable<any[]> {
    const classes = [
      { id: 1, name: 'Bajo peso', minIMC: 0, maxIMC: 18.49 },
      { id: 2, name: 'Peso normal', minIMC: 18.5, maxIMC: 24.99 },
      { id: 3, name: 'Sobrepeso', minIMC: 25, maxIMC: 29.99 },
      { id: 4, name: 'Obesidad grado I', minIMC: 30, maxIMC: 34.99 },
      { id: 5, name: 'Obesidad grado II', minIMC: 35, maxIMC: 39.99 },
      { id: 6, name: 'Obesidad grado III', minIMC: 40, maxIMC: 999 }
    ];

    return of(classes).pipe(delay(200));
  }

  // Método local para calcular IMC 
  calculateLocalIMC(weight: number, height: number): number {
    // height ya viene en metros, no necesitamos convertir
    return weight / (height * height);
  }

  // Método local para clasificar IMC
  classifyIMC(imc: number): string {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso Normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidad grado I';
    if (imc < 40) return 'Obesidad grado II';
    return 'Obesidad grado III';
  }
}
