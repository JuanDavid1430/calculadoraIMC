import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recommendation, Rutine, Diet } from '../models/recommendation.model';
import { Disability } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRecommendations(userId: number): Observable<Recommendation> {
    return this.http.get<Recommendation>(`${this.apiUrl}/recommendation/${userId}`);
  }

  getRutines(): Observable<Rutine[]> {
    return this.http.get<Rutine[]>(`${this.apiUrl}/rutines`);
  }

  getDiets(): Observable<Diet[]> {
    return this.http.get<Diet[]>(`${this.apiUrl}/diets`);
  }

  getDisabilities(): Observable<Disability[]> {
    return this.http.get<Disability[]>(`${this.apiUrl}/disabilities`);
  }

  getRutinesByClass(classId: number): Observable<Rutine[]> {
    return this.http.get<Rutine[]>(`${this.apiUrl}/rutines/class/${classId}`);
  }

  getDietsByClass(classId: number): Observable<Diet[]> {
    return this.http.get<Diet[]>(`${this.apiUrl}/diets/class/${classId}`);
  }
}
