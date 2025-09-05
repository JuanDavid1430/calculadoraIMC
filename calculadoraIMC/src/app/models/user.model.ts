export interface User {
  id?: number;
  email: string;
  password?: string;
  idPerson: number;
  image?: string;
  person?: Person;
}

export interface Person {
  id?: number;
  name: string;
  lastname: string;
  age: number;
  gender: 'M' | 'F';
  idDisability?: number;
  disability?: Disability;
}

export interface Disability {
  id: number;
  name: string;
}
