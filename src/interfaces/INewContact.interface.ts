import { INewPerson } from "./INewPerson.interface";

export interface INewContact {
  pessoa: INewPerson;
  usuario: { id: number };
  email: string;
  privado: boolean;
  tag: string;
  telefone: string;
  id?: number;
  tipoContato: "CELULAR" | "TELEFONE" | "EMAIL";
}
