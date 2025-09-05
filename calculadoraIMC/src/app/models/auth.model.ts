export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    idPerson: number;
    image?: string;
    person: {
      id: number;
      name: string;
      lastname: string;
      age: number;
      gender: 'M' | 'F';
      idDisability?: number;
      disability?: {
        id: number;
        name: string;
      };
    };
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  person: {
    name: string;
    lastname: string;
    age: number;
    gender: 'M' | 'F';
    idDisability?: number;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
  };
}
