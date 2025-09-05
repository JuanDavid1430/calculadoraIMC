import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { History, IMCRequest, IMCResponse } from '../models/imc.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IMCService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  calculateIMC(data: IMCRequest): Observable<IMCResponse> {
    return this.http.post<IMCResponse>(`${this.apiUrl}/history/calculate`, data);
  }

  getHistory(userId: number): Observable<History[]> {
    return this.http.get<History[]>(`${this.apiUrl}/history/${userId}`);
  }

  getIMCClasses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/classes`);
  }

  // Método local para calcular IMC sin guardar
  calculateLocalIMC(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  // Método local para clasificar IMC
  classifyIMC(imc: number): string {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidad grado I';
    if (imc < 40) return 'Obesidad grado II';
    return 'Obesidad grado III';
  }
}
