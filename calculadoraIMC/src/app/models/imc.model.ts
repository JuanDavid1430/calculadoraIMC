export interface History {
  id?: number;
  idUser: number;
  weight: number;
  height: number;
  imc: number;
  classification: string;
  createdDate: Date;
  updatedDate?: Date;
}

export interface IMCClass {
  id: number;
  classLetter: string;
  min: number;
  max: number;
}

export interface IMCCalculation {
  weight: number;
  height: number;
  imc: number;
  classification: string;
}

export interface IMCRequest {
  weight: number;
  height: number;
}

export interface IMCResponse {
  id: number;
  weight: number;
  height: number;
  imc: number;
  classification: string;
  createdDate: Date;
}

export interface ImcResult {
  id?: number;
  imc: number;
  weight: number;
  height: number;
  classification: string;
  date: Date;
  userId: number;
}

export interface ImcCalculation {
  weight: number;
  height: number;
  imc: number;
  classification: string;
  date: Date;
  userId: number;
}
