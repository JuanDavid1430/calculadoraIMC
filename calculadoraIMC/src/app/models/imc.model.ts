export interface History {
  id?: number;
  idUser: number;
  weight: number;
  height: number;
  imc: number;
  createdDate: Date;
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
