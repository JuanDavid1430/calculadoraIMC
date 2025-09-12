import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Array en memoria para almacenar usuarios
  private users: User[] = [
    {
      id: 1,
      email: 'admin',
      password: '12345',
      idPerson: 1,
      person: {
        id: 1,
        name: 'Admin',
        lastname: 'SmithStrong',
        age: 30,
        gender: 'M'
      }
    }
  ];

  private nextUserId = 2;
  private nextPersonId = 2;

  constructor() {
    this.loadCurrentUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Simular búsqueda en array
    const user = this.users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      // Generar token simulado
      const token = this.generateToken(user);
      
      const response: LoginResponse = {
        token: token,
        user: {
          id: user.id!,
          email: user.email,
          idPerson: user.idPerson,
          image: user.image,
          person: {
            id: user.person!.id!,
            name: user.person!.name,
            lastname: user.person!.lastname,
            age: user.person!.age,
            gender: user.person!.gender,
            idDisability: user.person!.idDisability,
            disability: user.person!.disability
          }
        }
      };

      return of(response).pipe(
        delay(500), // Simular delay de red
        tap(response => {
          this.setToken(response.token);
          this.currentUserSubject.next({
            ...user,
            password: undefined // No exponer la contraseña
          } as User);
        })
      );
    } else {
      return throwError(() => new Error('Credenciales inválidas')).pipe(delay(500));
    }
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    // Verificar si el email ya existe
    const existingUser = this.users.find(u => u.email === userData.email);
    
    if (existingUser) {
      return throwError(() => new Error('El email ya está registrado')).pipe(delay(500));
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: this.nextUserId++,
      email: userData.email,
      password: userData.password,
      idPerson: this.nextPersonId++,
      person: {
        id: this.nextPersonId - 1,
        ...userData.person
      }
    };

    // Agregar al array
    this.users.push(newUser);

    const response: RegisterResponse = {
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id!,
        email: newUser.email
      }
    };

    return of(response).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      // Simular decodificación del token para obtener el usuario
      try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        const user = this.users.find(u => u.id === userData.userId);
        if (user) {
          this.currentUserSubject.next({
            ...user,
            password: undefined
          } as User);
        }
      } catch (error) {
        // Token inválido, limpiar
        this.logout();
      }
    }
  }

  private generateToken(user: User): string {
    // Simular generación de JWT
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId: user.id, 
      email: user.email, 
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    }));
    const signature = btoa('smithstrong-secret-key');
    return `${header}.${payload}.${signature}`;
  }

  // Método para obtener todos los usuarios (útil para desarrollo)
  getAllUsers(): User[] {
    return this.users.map(user => ({ ...user, password: undefined } as User));
  }
}
