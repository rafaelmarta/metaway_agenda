export interface INewUser {
  usuario: {
    cpf: string;
    nome: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    username: string;
    password: string;
    id?: number;
  };
  tipos?: string[];
}

export interface IUser {
  cpf: string;
  nome: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  username: string;
  password: string;
  id: number;
}
