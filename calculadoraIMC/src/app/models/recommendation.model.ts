export interface Rutine {
  id: number;
  name: string;
  description: string;
  idClass: number;
  class?: IMCClass;
}

export interface Diet {
  id: number;
  name: string;
  description: string;
  idClass: number;
  class?: IMCClass;
}

export interface RutineDisability {
  id: number;
  idRutine: number;
  idDisability: number;
}

export interface Recommendation {
  rutines: Rutine[];
  diets: Diet[];
  currentIMC: number;
  classification: string;
}

export interface IMCClass {
  id: number;
  classLetter: string;
  min: number;
  max: number;
}
