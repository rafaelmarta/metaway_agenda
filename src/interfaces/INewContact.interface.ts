import { INewPerson } from "./INewPerson.interface";
import { INewUser } from "./INewUser.interface";

export interface INewContact {
  pessoa: INewPerson;
  // usuario: INewUser;
  usuario: { id: number };
  email: string;
  privado: boolean;
  tag: string;
  telefone: string;
  id?: number;
  tipoContato: "CELULAR" | "TELEFONE" | "EMAIL";
}
